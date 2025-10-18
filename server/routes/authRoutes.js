import { Router } from 'express';
import { login, logout, verify } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { validateBody } from '../middleware/validationMiddleware.js';
import { loginSchema } from '../validation/schemas.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

router.post('/login', authLimiter, validateBody(loginSchema), asyncHandler(login));
router.post('/logout', authenticateToken, asyncHandler(logout));
router.get('/verify', authenticateToken, asyncHandler(verify));

export default router;
