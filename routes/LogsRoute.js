import express from 'express';
import { getLogs, deleteLog, getLogById, getLogsByDate } from '../controllers/LogsController.js';

const router = express.Router();
/* 
 * #swagger.tags = ['Logs']
 * #swagger.summary = 'Rota para gerenciar logs do sistema'
 */


router.get('/', getLogs);
router.get('/:id', getLogById);
router.get('/data', getLogsByDate);
router.delete('/:id', deleteLog);

export default router