import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.POSTGRES_URL, // Use the connection string from environment variables
});

export const dbConnect = async () => {
  try {
    await client.connect();
    console.log('Connected to the PostgreSQL database!');
  } catch (error) {
    console.error('Error connecting to the database', error);
    process.exit(1);
  }
};

export default client;
