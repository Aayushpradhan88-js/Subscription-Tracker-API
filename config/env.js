import { config } from 'dotenv';

// eslint-disable-next-line no-undef
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });
export const {
    PORT, NODE_ENV,
    JWT_SECRET, JWT_EXPIRES_IN,
    ARCJET_KEY, ARCJET_ENV,
    QSTASH_URL, QSTASH_TOKEN,
    MAIL_PASSWORD
    // eslint-disable-next-line no-undef
} = process.env