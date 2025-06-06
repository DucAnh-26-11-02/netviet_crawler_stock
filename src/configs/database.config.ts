import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  uri: process.env.DB_URI,
  retryAttempts: parseInt(process.env.DB_RETRY_ATTEMPTS, 10) || 5,
  retryDelay: parseInt(process.env.DB_RETRY_DELAY, 10) || 5000,
}));
