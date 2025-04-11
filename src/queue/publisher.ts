import amqp from 'amqplib';

export async function publishEvent(type: string, data: any, source = 'API') {
  const connection = await amqp.connect('amqp://rabbitmq');
  const channel = await connection.createChannel();
  
  await channel.assertExchange('inventory', 'fanout', { durable: false });
  
  const event = {
    type,
    source,
    data,
    timestamp: new Date().toISOString()
  };

  channel.publish('inventory', '', Buffer.from(JSON.stringify(event)));
  
  setTimeout(() => connection.close(), 500); // Close connection after brief delay
}