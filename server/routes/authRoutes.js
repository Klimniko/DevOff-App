import { Router } from 'express';
import { body } from 'express-validator';
import { login, logout, verify } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post(
  '/login',
  authLimiter,
  [body('username').trim().notEmpty(), body('password').isString().isLength({ min: 4 })],
  login
);

router.post('/logout', authenticateToken, logout);
router.get('/verify', authenticateToken, verify);

export default router;
