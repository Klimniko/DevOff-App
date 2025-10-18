import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { bulkExport, exportCsv, exportExcel, exportPdf } from '../controllers/exportController.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

router.use(authenticateToken);
router.get('/csv/:id', asyncHandler(exportCsv));
router.get('/excel/:id', asyncHandler(exportExcel));
router.get('/pdf/:id', asyncHandler(exportPdf));
router.post('/bulk', asyncHandler(bulkExport));

export default router;
