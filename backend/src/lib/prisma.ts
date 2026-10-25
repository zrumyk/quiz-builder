import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';
import config from '../configuration/config.js';

if (!config.database_url) {
  throw new Error('DATABASE_URL is required');
}

const adapter = new PrismaPg({
  connectionString: config.database_url,
});

export const prisma = new PrismaClient({ adapter });