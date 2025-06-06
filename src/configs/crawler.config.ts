import { registerAs } from '@nestjs/config';

export default registerAs('crawler', () => ({
  apiKey: process.env.FMP_API_KEY || '',
  url: process.env.FMP_URL || 'https://financialmodelingprep.com/stable',
}));
