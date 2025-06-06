import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  env: process.env.NODE_END || 'dev',
  name: 'crawler-stocks',
  port: parseInt(process.env.PORT, 10) || 3000,
  apiPrefix: 'api',
}));
