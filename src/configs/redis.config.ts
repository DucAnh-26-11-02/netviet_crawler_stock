import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  host: process.env.REDIS_HOST || 'localhost',
  user: parseInt(process.env.REDIS_USER || 'default'),
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || '',
  ttl: parseInt(process.env.REDIS_TTL || '60'),
  databaase: process.env.REDIS_DB || '',
}));
