import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import { errorHandler } from './middleware/errorMiddleware.js';

import usersRouter from './modules/users/routes.js';
import shopsRouter from './modules/shops/routes.js';
import queueRouter from './modules/queue/routes.js';
import bookingsRouter from './modules/bookings/routes.js';
import barbersRouter from './modules/barbers/routes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// API routes - prefixed with /api
app.use('/api/users', usersRouter);
app.use('/api/shops', shopsRouter);
app.use('/api/queue', queueRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/barbers', barbersRouter);

// Health
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Global error handler
app.use(errorHandler);

export default app;
