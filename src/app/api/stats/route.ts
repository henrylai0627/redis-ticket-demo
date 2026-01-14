import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { getRabbitMQChannel } from "@/lib/rabbitmq";

export async function GET() {
  try {
    // 1. Get total records in DB
    const dbCount = await prisma.requestLog.count();

    // 2. Get processed count from Redis (fast counter)
    const redisProcessedStr = await redis.get("stats:processed_count");
    const processedCount = redisProcessedStr ? parseInt(redisProcessedStr) : 0;

    // 3. Get Queue Depth (approximate)
    let queueDepth = 0;
    try {
      const channel = await getRabbitMQChannel();
      const check = await channel.checkQueue("demo_queue");
      queueDepth = check.messageCount;
    } catch {
      queueDepth = -1; // Error getting queue status
    }

    return NextResponse.json({
      dbCount,
      processedCount,
      queueDepth,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
