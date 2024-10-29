import express from 'express';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

// app.use(
//   cors({
//     origin: 'http://iot-test.online:3000',
//     credentials: true,
//   })
// );

app.use(
  cors({
    origin: 'http://iot-test.online:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(morgan('dev'));

app.use(express.json()); //convertir los request body en json
app.use(cookieParser());

app.use('/api', authRoutes);

export default app;
