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

import { PrismaClient } from '@prisma/client';

// Augment the NodeJS global type to include our prisma instance
declare global {
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // In development mode, we reuse the Prisma Client to prevent exhausting the database connection limit
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;