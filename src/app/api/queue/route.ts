import { NextResponse } from "next/server";
import { getRabbitMQChannel } from "@/lib/rabbitmq";
import { redis } from "@/lib/redis";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = JSON.stringify(body);

    // 1. Send to RabbitMQ
    const channel = await getRabbitMQChannel();
    channel.sendToQueue("demo_queue", Buffer.from(message));

    // 2. Add to Redis Stream
    await redis.xadd("demo_stream", "*", "message", message);

    // REMOVED: Direct DB write to simulate high-performance non-blocking API
    // The worker will pick this up from RabbitMQ and handles the DB write.

    return NextResponse.json({
      success: true,
      message: "Queued for processing",
    });
  } catch (error) {
    console.error("Queue error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to queue" },
      { status: 500 }
    );
  }
}
