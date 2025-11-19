import dotenv from 'dotenv';
dotenv.config({ path: '.env.production.local' });
import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cron from 'node-cron';
import authRoutes from './routes/authroutes.js';
import userRoutes from './routes/userroutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import sendRenewalRemainders from './jobs/sendRenewalRemainders.js';
import { PORT } from './config/env.js';
import errorMiddleware from './middlewares/errormiddleware.js';
import dbConnection from './config/db.js';

// import arcjetMiddleware from './middelewares/arcjetmiddleware.js'; UNDER DEVELOPMENT

const app = express();
dbConnection();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/subscriptions', subscriptionRoutes);

app.use(errorMiddleware);

cron.schedule("0 9 * * *", async () => {  // हर रोज सुबह 9 बजे (UTC)
  console.log("Running daily renewal reminder job...");
  try {
    await sendRenewalRemainders();
  } catch (err) {
    console.error("Cron job error:", err);
  }
});
//Poduction code for corn jobs
// cron.schedule("0 9 * * *", sendRenewalRemainders, {
//   timezone: "Asia/Kathmandu"  // ya "Asia/Kolkata"
// })


/*token:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGIzMmM5YTE1ZDFhODM4OTkyMTUwOTkiLCJpYXQiOjE3NTY1NzI4MjYsImV4cCI6MTc1NjY1OTIyNn0.YZEkdlfnQL_0jWifZxvGXFb-3D7sCi-EFVHlEV9mbhI
*/

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});