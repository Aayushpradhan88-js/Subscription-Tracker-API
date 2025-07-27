import {config} from 'dotenv';

config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });



export const {
    PORT, NODE_ENV,
    JWT_SECRET, JWT_EXPIRES_IN,
    ARCJET_KEY, ARCJET_ENV,
    QSTASH_KEY, QSTASH_TOKEN
} = process.env;