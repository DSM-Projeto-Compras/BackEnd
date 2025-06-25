import express from 'express';
import { getLogs, deleteLog, getLogById, getLogsByDate } from '../controllers/LogsController.js';
import authAdmin from '../middlewares/authAdmin.js';

const router = express.Router();
/* 
 * #swagger.tags = ['Logs']
 * #swagger.summary = 'Rota para gerenciar logs do sistema'
 */

router.get('/por-data', authAdmin, getLogsByDate);

router.get('/', authAdmin, getLogs);
router.get('/:id', authAdmin, getLogById);
router.delete('/:id', authAdmin, deleteLog);

export default router