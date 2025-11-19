import dotenv from 'dotenv';
dotenv.config({ path: '.env.production.local' });
import cors from 'cors';

import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import { PORT } from './config/env.js';

import authroutes from './routes/authroutes.js';
import userroutes from './routes/userroutes.js';
import subscriptionroutes from './routes/subscriptionRoutes.js';
import workflowroutes from './routes/upstashworkflowroutes.js';

import errorMiddleware from './middlewares/errormiddleware.js';
// import arcjetMiddleware from './middelewares/arcjetmiddleware.js';
import dbConnection from './config/db.js';
import { sendMail } from './config/nodemailer.js';

const app = express();
dbConnection();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(arcjetMiddleware)

app.use('/api/v1/auth', authroutes);
app.use('/api/v1/user', userroutes);
app.use('/api/v1/subscriptions/user', subscriptionroutes);
app.use('/api/v1/workflow', workflowroutes);

app.use(errorMiddleware);

app.post('/sendmail', async (req, res) => {
  const { email } = req.query
  // console.log(req.headers)
  if (!email) return res.send("email is required").status(400)
  const result = await sendMail(email);
  // console.log(result)
  if (result == null) return res.send("user not found").status(404)
  if (result) {
    res.send("Message send successfully.").status(200)
  } else {
    res.send("unable to send mail.").status(500)
  }
  fetch("ff", { method: "POST" })
});

/*token:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGIzMmM5YTE1ZDFhODM4OTkyMTUwOTkiLCJpYXQiOjE3NTY1NzI4MjYsImV4cCI6MTc1NjY1OTIyNn0.YZEkdlfnQL_0jWifZxvGXFb-3D7sCi-EFVHlEV9mbhI
*/

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});