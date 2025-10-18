import { Router } from 'express';
import { getStats } from '../controllers/dashboardController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

router.get('/stats', authenticateToken, asyncHandler(getStats));

export default router;
