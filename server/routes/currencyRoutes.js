import { Router } from 'express';
import { getRates, refreshRate } from '../controllers/currencyController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/rates', authenticateToken, getRates);
router.get('/refresh', authenticateToken, refreshRate);

export default router;
