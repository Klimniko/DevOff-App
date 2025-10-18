import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import currencyRoutes from './routes/currencyRoutes.js';
import calculationRoutes from './routes/calculationRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import exportRoutes from './routes/exportRoutes.js';
import errorHandler from './middleware/errorMiddleware.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { authenticateToken } from './middleware/authMiddleware.js';
import logger from './utils/logger.js';
import { fetchRate } from './controllers/currencyController.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN?.split(',') || ['http://localhost:5173'],
    credentials: true
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan('combined'));
app.use('/api', apiLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/currency', currencyRoutes);
app.use('/api/calculations', calculationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/export', exportRoutes);

app.get('/api/health', authenticateToken, (req, res) => {
  res.json({ status: 'ok' });
});

app.use(errorHandler);

if (process.env.NODE_ENV === 'production') {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const clientBuildPath = path.join(__dirname, '../client/dist');
  app.use(express.static(clientBuildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

app.listen(PORT, async () => {
  logger.info(`Server running on port ${PORT}`);
  try {
    await fetchRate(true);
    logger.info('Initial exchange rate cached');
  } catch (error) {
    logger.warn('Unable to prefetch exchange rate: %s', error.message);
  }
});
