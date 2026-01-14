# Redis Queue Demo

This project demonstrates a high-traffic handling architecture using Next.js, Redis Streams, RabbitMQ, and PostgreSQL.

## Prerequisites

- Docker and Docker Compose
- Node.js

## Getting Started

1. **Start Infrastructure**:
   Run the following command to start PostgreSQL, Redis, and RabbitMQ:

   ```bash
   docker-compose up -d
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Setup Database**:
   Push the schema to the database:

   ```bash
   npx prisma db push
   ```

4. **Run Development Server**:

   ```bash
   npm run dev
   ```

5. **Test the Queue**:
   Send a POST request to the API:

   ```bash
   curl -X POST http://localhost:3000/api/queue -H "Content-Type: application/json" -d '{"message": "Hello World"}'
   ```

   This will:

   - Publish a message to RabbitMQ (`demo_queue`).
   - Add an event to Redis Stream (`demo_stream`).
   - Log the request to PostgreSQL (`RequestLog`).

## Architecture

- **Next.js**: Frontend and API routes.
- **Redis**: Used for high-speed stream ingestion.
- **RabbitMQ**: Used for reliable message queuing.
- **PostgreSQL**: Used for persistent storage and logs.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

### ⚠️ Critical Deployment Note

This project uses **Docker Compose** for local development (RabbitMQ, Redis, Postgres). Vercel **does not** host these services. To deploy this to Vercel, you must use external cloud providers:

1. **PostgreSQL**: Use [Neon](https://neon.tech) or [Supabase](https://supabase.com).
2. **Redis**: Use [Upstash](https://upstash.com) (Redis).
3. **RabbitMQ**: Use [CloudAMQP](https://www.cloudamqp.com).

### Deployment Steps

1. Push this code to GitHub (Repo: `redis-ticket-demo`).
2. Import the project in Vercel.
3. Add the following **Environment Variables** in Vercel settings (using your cloud provider URLs):
   - `DATABASE_URL`
   - `REDIS_URL`
   - `RABBITMQ_URL`
4. The **Worker Script** (`npm run worker`) cannot run on Vercel (it triggers a timeout). You must run the worker locally or on a VPS (like Railway/Render).
