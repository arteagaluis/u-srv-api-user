import express from 'express';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import deviceRoutes from './routes/device.routes.js';

import dotenv from 'dotenv';

dotenv.config();
const app = express();

const emailUri =
  process.env.NODE_ENV === 'production'
    ? process.env.BASE_PATH_PROD
    : process.env.BASE_PATH_LOCAL;

// app.use(
//   cors({
//     origin: 'http://iot-test.online:3000',
//     credentials: true,
//   })
// );

app.use(
  cors({
    origin: emailUri,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(morgan('dev'));

app.use(express.json()); //convertir los request body en json
app.use(cookieParser());

app.use('/api', authRoutes);
app.use('/api', deviceRoutes);

export default app;
