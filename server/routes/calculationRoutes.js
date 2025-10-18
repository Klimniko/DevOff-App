import { Router } from 'express';
import { body } from 'express-validator';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { create, getById, list, remove, update } from '../controllers/calculationController.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

const validationRules = [
  body('project_name').isString().trim().notEmpty(),
  body('buying_price_usd').isFloat({ min: 0 }),
  body('selling_price_eur').isFloat({ min: 0 }),
  body('working_days').isInt({ min: 1 }),
  body('exchange_rate').isFloat({ min: 0 }),
  body('commission_eur').optional().isFloat()
];

router.use(authenticateToken);
router.get('/', asyncHandler(list));
router.get('/:id', asyncHandler(getById));
router.post('/', validationRules, asyncHandler(create));
router.put('/:id', validationRules, asyncHandler(update));
router.delete('/:id', asyncHandler(remove));

export default router;
