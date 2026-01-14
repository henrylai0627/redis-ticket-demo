import "dotenv/config";
import { getRabbitMQChannel } from "./lib/rabbitmq";
import { prisma } from "./lib/prisma";
import { redis } from "./lib/redis";

const QUEUE_NAME = "demo_queue";

async function startWorker() {
  console.log("👷 Worker started. Waiting for messages...");

  try {
    const channel = await getRabbitMQChannel();

    // Prefetch: Only handle 1 message at a time (simulating heavy processing)
    channel.prefetch(1);

    channel.consume(QUEUE_NAME, async (msg) => {
      if (msg) {
        const content = msg.content.toString();
        // console.log(`📥 Received: ${content}`);

        try {
          // 1. Simulate Heavy Processing (e.g., AI inference, key generation, email sending)
          const processingHost = `Worker-${process.pid}`;
          await new Promise((resolve) => setTimeout(resolve, 500)); // 500ms delay

          // 2. Write to Postgres (The standard persistence layer)
          const data = JSON.parse(content);

          await prisma.requestLog.create({
            data: {
              content: JSON.stringify({
                original: data,
                processedBy: processingHost,
                timestamp: new Date().toISOString(),
              }),
            },
          });

          // 3. (Optional) Increment processed count in Redis for live dashboard
          await redis.incr("stats:processed_count");

          // 4. Acknowledge (Tell RabbitMQ we are done)
          channel.ack(msg);
          // console.log('✅ Processed & Saved');
        } catch (err) {
          console.error("❌ Processing failed", err);
          // channel.nack(msg); // Re-queue if failed
        }
      }
    });
  } catch (error) {
    console.error("Initial Connection Error:", error);
  }
}

startWorker();
