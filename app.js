import dotenv from 'dotenv';
dotenv.config({path: '.env.production.local'});

import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';


import { PORT } from './config/env.js';
import authroutes from './routes/authroutes.js';
import userroutes from './routes/userroutes.js';
// import subscriptionroutes from './routes/subscriptionroutes.js';

import dbConnection from './db/db.js';
import errorMiddleware from './middlewares/errormiddleware.js';

const app = express();
dbConnection();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/v1/auth', authroutes);
app.use('/api/v1/users', userroutes);
// app.use('/api/v1/subscriptions', subscriptionroutes);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});