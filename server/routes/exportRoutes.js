import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { bulkExport, exportCsv, exportExcel, exportPdf } from '../controllers/exportController.js';

const router = Router();

router.use(authenticateToken);
router.get('/csv/:id', exportCsv);
router.get('/excel/:id', exportExcel);
router.get('/pdf/:id', exportPdf);
router.post('/bulk', bulkExport);

export default router;
