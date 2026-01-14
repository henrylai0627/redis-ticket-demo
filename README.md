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

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
