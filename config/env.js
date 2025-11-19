import { config } from 'dotenv';

// eslint-disable-next-line no-undef
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const {
    PORT,  SERVER_URL, NODE_ENV,
    JWT_SECRET, JWT_EXPIRES_IN,
    ARCJET_KEY, ARCJET_ENV,
    MAIL_PASSWORD
    // eslint-disable-next-line no-undef
} = process.env;