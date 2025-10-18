import { Router } from 'express';
import { getStats } from '../controllers/dashboardController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/stats', authenticateToken, getStats);

export default router;
