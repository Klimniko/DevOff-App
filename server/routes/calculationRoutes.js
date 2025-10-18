import { Router } from 'express';
import { body } from 'express-validator';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { create, getById, list, remove, update } from '../controllers/calculationController.js';

const router = Router();

const validationRules = [
  body('project_name').isString().trim().notEmpty(),
  body('buying_price_usd').isFloat({ min: 0 }),
  body('selling_price_eur').isFloat({ min: 0 }),
  body('working_days').isInt({ min: 1 }),
  body('exchange_rate').isFloat({ min: 0 }),
  body('commission_eur').isFloat()
];

router.use(authenticateToken);
router.get('/', list);
router.get('/:id', getById);
router.post('/', validationRules, create);
router.put('/:id', validationRules, update);
router.delete('/:id', remove);

export default router;
