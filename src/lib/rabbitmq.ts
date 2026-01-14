import * as amqp from "amqplib";
import { Channel } from "amqplib";

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let connection: any = null;
let channel: Channel | null = null;

export const getRabbitMQChannel = async (): Promise<Channel> => {
  if (channel) return channel;

  try {
    connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();

    if (!channel) {
      throw new Error("Failed to create RabbitMQ channel");
    }

    // Ensure queue exists
    await channel.assertQueue("demo_queue", { durable: true });
    return channel;
  } catch (error) {
    console.error("Failed to connect to RabbitMQ:", error);
    throw error;
  }
};
