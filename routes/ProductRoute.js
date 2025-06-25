import express from "express";
import {
  getProducts,
  getProductByUserId,
  createProduct,
  deleteProduct,
  updateProduct,
  updateProductStatus,
} from "../controllers/ProductController.js";
import { validaProduto } from "../validators/ProductValidator.js";
import auth from "../middlewares/auth.js";
import authAdmin from "../middlewares/authAdmin.js";

const router = express.Router();

/* 
 * #swagger.tags = ['CRUD de Produtos']
 * #swagger.summary = 'Rota para gerenciamento de produtos'
 */

router.get("/", auth, getProductByUserId);
router.post("/", auth, validaProduto, createProduct);
router.delete("/:id", auth, deleteProduct);
router.put("/", auth, validaProduto, updateProduct);

// Rotas que precisam de permissão de administrador
router.get("/all", authAdmin, getProducts);
router.put("/aprove/:id", authAdmin, validaProduto, updateProductStatus);

export default router;
