import { Router } from 'express';
import { getRates, refreshRate } from '../controllers/currencyController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

router.get('/rates', authenticateToken, asyncHandler(getRates));
router.get('/refresh', authenticateToken, asyncHandler(refreshRate));

export default router;
