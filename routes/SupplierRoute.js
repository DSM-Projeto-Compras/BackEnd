import express from "express";
import {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "../controllers/SupplierController.js";
import { validaFornecedor } from "../validators/SupplierValidator.js";
import authAdmin from "../middlewares/authAdmin.js";

const router = express.Router();

/* 
 * #swagger.tags = ['CRUD de Fornecedores']
 * #swagger.summary = 'Rota para gerenciamento de fornecedores (somente admin)'
 */

// Todas as rotas de fornecedor precisam de permissão de administrador
router.get("/", authAdmin, getSuppliers);
router.get("/:id", authAdmin, getSupplierById);
router.post("/", authAdmin, validaFornecedor, createSupplier);
router.put("/:id", authAdmin, validaFornecedor, updateSupplier);
router.delete("/:id", authAdmin, deleteSupplier);

export default router;
