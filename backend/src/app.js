import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import winston from 'winston';
import dotenv from 'dotenv';

import { errorHandler } from './middleware/errorMiddleware.js';

import usersRouter from './modules/users/routes.js';
import shopsRouter from './modules/shops/routes.js';
import queueRouter from './modules/queue/routes.js';
import bookingsRouter from './modules/bookings/routes.js';
import barbersRouter from './modules/barbers/routes.js';
import authRouter from './modules/auth/routes.js';
import paymentsRouter from './modules/payments/routes.js';
import adminRouter from './modules/admin/routes.js';
import receiptsRouter from './modules/receipts/routes.js';
import slotsRouter from './modules/slots/routes.js';

dotenv.config();

const app = express();

// security
app.use(helmet());
app.use(cors());
// parse JSON and keep raw body for webhook signature verification
app.use(express.json({ verify: (req, res, buf) => { req.rawBody = buf.toString(); } }));

// rate limiting (basic)
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use(limiter);

// logging
app.use(morgan('combined'));

// winston simple logger (console)
const logger = winston.createLogger({
  level: 'info',
  transports: [new winston.transports.Console()],
});
app.logger = logger;

// API routes - prefixed with /api
app.use('/api/users', usersRouter);
app.use('/api/shops', shopsRouter);
app.use('/api/queue', queueRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/barbers', barbersRouter);
app.use('/api/auth', authRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/slots', slotsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/receipts', receiptsRouter);

// Health
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Global error handler
app.use(errorHandler);

export default app;
