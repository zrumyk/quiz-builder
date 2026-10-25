import 'dotenv/config';

const config = {
  port: Number(process.env.PORT ?? 3000),
  hostname: process.env.HOSTNAME ?? 'localhost',
  database_url: process.env.DATABASE_URL
};

export default config;