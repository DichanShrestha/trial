// import { Client } from 'pg';

// const client = new Client({
//   connectionString: process.env.POSTGRES_URL, // Use the connection string from environment variables
// });

// export const dbConnect = async () => {
//   try {
//     await client.connect();
//     console.log('Connected to the PostgreSQL database!');
//   } catch (error) {
//     console.error('Error connecting to the database', error);
//     process.exit(1);
//   }
// };

// export default client;


// lib/dbConnect.ts

import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

type GlobalThisWithPrisma = typeof globalThis & {
  prisma: PrismaClient | undefined;
}

const prisma = (globalThis as GlobalThisWithPrisma).prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  (globalThis as GlobalThisWithPrisma).prisma = prisma
}

export default prisma