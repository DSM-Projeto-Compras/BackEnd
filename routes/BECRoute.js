import express from "express";
import {
  getProducts,
  searchProduct,
  getProductDetails,
  searchAndGetDetails,
} from "../controllers/BECController.js";
import {
  validaBuscaProdutos,
  validaBuscaPorDescricao,
  validaDetalhesProduto,
} from "../validators/BECValidator.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

/**
 * @swagger
 * /api/bec/products:
 *   post:
 *     summary: Obter lista de produtos (autocomplete)
 *     tags: [BEC - Web Scraping]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prefixText:
 *                 type: string
 *                 description: Texto de busca
 *               count:
 *                 type: number
 *                 description: Quantidade de resultados (padrão 20)
 *     responses:
 *       200:
 *         description: Lista de produtos encontrados
 *       400:
 *         description: Erro de validação
 *       500:
 *         description: Erro do servidor
 */
router.post("/products", auth, validaBuscaProdutos, getProducts);

/**
 * @swagger
 * /api/bec/search:
 *   post:
 *     summary: Buscar produto por descrição
 *     tags: [BEC - Web Scraping]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 description: Descrição do produto
 *     responses:
 *       200:
 *         description: ID do produto encontrado
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro do servidor
 */
router.post("/search", auth, validaBuscaPorDescricao, searchProduct);

/**
 * @swagger
 * /api/bec/product/{cod_id}:
 *   get:
 *     summary: Obter detalhes de um produto
 *     tags: [BEC - Web Scraping]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cod_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Código do produto
 *     responses:
 *       200:
 *         description: Detalhes do produto
 *       400:
 *         description: Erro de validação
 *       500:
 *         description: Erro do servidor
 */
router.get("/product/:cod_id", auth, validaDetalhesProduto, getProductDetails);

/**
 * @swagger
 * /api/bec/search-details:
 *   post:
 *     summary: Buscar e obter detalhes do produto em uma única chamada
 *     tags: [BEC - Web Scraping]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 description: Descrição do produto
 *     responses:
 *       200:
 *         description: Detalhes completos do produto
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro do servidor
 */
router.post(
  "/search-details",
  auth,
  validaBuscaPorDescricao,
  searchAndGetDetails
);

export default router;
