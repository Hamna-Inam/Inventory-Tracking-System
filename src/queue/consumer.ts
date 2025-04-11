// src/consumers/productConsumer.ts
import amqp from 'amqplib';
import { pool } from "../inventory/db";
import { logAction } from '../inventory/queries';
import redisClient from '../utils/redisClient';

const MAX_RETRIES = 5;
const RETRY_DELAY = 5000; // 5 seconds

export const startConsumer = async (retryCount = 0) => {
  let connection;
  let channel;
  
  try {
    // Use environment variable for RabbitMQ URL with explicit fallback
    const rabbitUrl = process.env.RABBITMQ_URL;
    console.log('Environment RABBITMQ_URL:', rabbitUrl);
    
    if (!rabbitUrl) {
      console.error('RABBITMQ_URL environment variable not found');
      throw new Error('RABBITMQ_URL environment variable not found');
    }

    console.log(`Connecting to RabbitMQ at ${rabbitUrl} (attempt ${retryCount + 1}/${MAX_RETRIES})`);
    connection = await amqp.connect(rabbitUrl);
    channel = await connection.createChannel();

    await channel.assertExchange('inventory', 'fanout', { durable: false });
    const queue = await channel.assertQueue('', { exclusive: true });
    await channel.bindQueue(queue.queue, 'inventory', '');

    console.log('Consumer ready and waiting for messages...');

    channel.consume(queue.queue, async (msg) => {  
      if (msg) {
        try {
          const event = JSON.parse(msg.content.toString());
          console.log('Recording audit:', event.type);

          await pool.query(
            logAction,
            [event.type || 'system', JSON.stringify(event.data)]
          );
          console.log(`Logged audit for ${event.type}`);

          if (event.type === 'GET_PRODUCT' && event.data?.id) {
            const cacheKey = `store-product:${event.data.id}`;
    
            await redisClient.set(cacheKey, JSON.stringify(event.data), {
              EX: 3600 // 1 hour expiry
            });
    
            console.log(`Cached product ${event.data.id} in Redis`);
          }

          if (event.type === 'GET_STORE' && event.data?.id) {
            const cacheKey = `store:${event.data.id}`;
    
            await redisClient.set(cacheKey, JSON.stringify(event.data), {
              EX: 3600 // 1 hour expiry
            });
    
            console.log(`Cached store ${event.data.id} in Redis`);
          }

          // Handle cache invalidation for updates
          if (event.type === 'UPDATE_PRODUCT' && event.data?.id) {
            const productCacheKey = `store-product:${event.data.id}`;
            await redisClient.del(productCacheKey);
            console.log(`Invalidated product cache for ${event.data.id}`);
          }

          if (event.type === 'UPDATE_STORE' && event.data?.id) {
            const storeCacheKey = `store:${event.data.id}`;
            await redisClient.del(storeCacheKey);
            console.log(`Invalidated store cache for ${event.data.id}`);
          }

          // Handle cache invalidation for deletes
          if (event.type === 'DELETE_PRODUCT' && event.data?.id) {
            const productCacheKey = `store-product:${event.data.id}`;
            await redisClient.del(productCacheKey);
            console.log(`Invalidated product cache for ${event.data.id}`);
          }

          if (event.type === 'DELETE_STORE' && event.data?.id) {
            const storeCacheKey = `store:${event.data.id}`;
            await redisClient.del(storeCacheKey);
            console.log(`Invalidated store cache for ${event.data.id}`);
          }
        } catch (error) {
          console.error('Error processing message:', error);
        }
      }
    }, { noAck: true });

    // Handle connection errors
    connection.on('error', (err) => {
      console.error('RabbitMQ connection error:', err);
    });

    connection.on('close', () => {
      console.log('RabbitMQ connection closed. Attempting to reconnect');
      if (retryCount < MAX_RETRIES) {
        setTimeout(() => startConsumer(retryCount + 1), RETRY_DELAY);
      } else {
        console.error('Max retries reached. Giving up on RabbitMQ connection.');
      }
    });

  } catch (error) {
    console.error('Consumer error:', error);
    if (connection) {
      await connection.close();
    }
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying in ${RETRY_DELAY/1000} seconds...`);
      setTimeout(() => startConsumer(retryCount + 1), RETRY_DELAY);
    } else {
      console.error('Max retries reached. Giving up on RabbitMQ connection.');
    }
  }
};

// Start the consumer
startConsumer();