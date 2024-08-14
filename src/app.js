import express from 'express';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

const corsOptions = {
  origin: 'http://localhost', // Cambia esto al dominio de tu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Headers permitidos
  credentials: true, // Permitir cookies y autenticación
};

app.use(cors(corsOptions));

app.use(morgan('dev'));

app.use(express.json()); //convertir los request body en json
app.use(cookieParser());

app.use('/api', authRoutes);

export default app;
