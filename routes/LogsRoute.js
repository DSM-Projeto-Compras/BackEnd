import express from 'express';
import { getLogs, deleteLog } from '../controllers/LogsController.js';

const router = express.Router();
/* 
 * #swagger.tags = ['Logs']
 * #swagger.summary = 'Rota para gerenciar logs do sistema'
 */


router.get('/', getLogs);
router.delete('/:id', deleteLog);

export default router