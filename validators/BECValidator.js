import { body, param } from "express-validator";

/**
 * Validação para busca de produtos (autocomplete)
 */
export const validaBuscaProdutos = [
  body("prefixText")
    .notEmpty()
    .withMessage("O campo 'prefixText' é obrigatório")
    .isString()
    .withMessage("O campo 'prefixText' deve ser uma string")
    .trim()
    .isLength({ min: 2 })
    .withMessage("O campo 'prefixText' deve ter no mínimo 2 caracteres"),
  body("count")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("O campo 'count' deve ser um número entre 1 e 100"),
];

/**
 * Validação para busca de produto por descrição
 */
export const validaBuscaPorDescricao = [
  body("description")
    .notEmpty()
    .withMessage("O campo 'description' é obrigatório")
    .isString()
    .withMessage("O campo 'description' deve ser uma string")
    .trim()
    .isLength({ min: 3 })
    .withMessage("O campo 'description' deve ter no mínimo 3 caracteres"),
];

/**
 * Validação para obter detalhes do produto
 */
export const validaDetalhesProduto = [
  param("cod_id")
    .notEmpty()
    .withMessage("O parâmetro 'cod_id' é obrigatório")
    .isString()
    .withMessage("O parâmetro 'cod_id' deve ser uma string")
    .trim(),
];
