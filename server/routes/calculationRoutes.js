import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { validateBody } from '../middleware/validationMiddleware.js';
import { calculationSchema } from '../validation/schemas.js';
import { create, getById, list, remove, update } from '../controllers/calculationController.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

router.use(authenticateToken);
router.get('/', asyncHandler(list));
router.get('/:id', asyncHandler(getById));
router.post('/', validateBody(calculationSchema), asyncHandler(create));
router.put('/:id', validateBody(calculationSchema), asyncHandler(update));
router.delete('/:id', asyncHandler(remove));

export default router;
