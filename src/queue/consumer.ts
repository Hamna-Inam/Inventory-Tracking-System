// src/consumers/productConsumer.ts
import amqp from 'amqplib';
import { pool } from "../inventory/db";
import { logAction } from '../inventory/queries';
import redisClient from '../utils/redisClient';

export const startConsumer = async () => {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    await channel.assertExchange('inventory', 'fanout', { durable: false });
    const queue = await channel.assertQueue('', { exclusive: true });
    await channel.bindQueue(queue.queue, 'inventory', '');

    console.log('🚀 Consumer ready and waiting for messages...');

    channel.consume(queue.queue, async (msg) => {  
      if (msg) {
        try {
          const event = JSON.parse(msg.content.toString());
          console.log('📝 Recording audit:', event.type);

            await pool.query(
              logAction,
              [event.type || 'system', JSON.stringify(event.data)]
            );
            console.log(`Logged `);

            if (event.type === 'GET_PRODUCT' && event.data?.id) {
              //const redis = await redisClient(); // get Redis connection
              const cacheKey = `store-product:${event.data.id}`;
      
              await redisClient.set(cacheKey, JSON.stringify(event.data), {
                EX: 3600 // 1 hour expiry
              });
      
              console.log(`Cached product ${event.data.id} in Redis`);
            }
      
          
        } catch (error) {
          console.error('Error processing message:', error);
        }
      }
    }, { noAck: true });

  } catch (error) {
    console.error('Consumer error:', error);
  }
}

// Start the consumer
startConsumer();