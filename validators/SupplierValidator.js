import { check } from "express-validator";

export const validaFornecedor = [
  check("nome")
    .notEmpty()
    .withMessage("É obrigatório informar o nome")
    .isString()
    .withMessage("O nome deve ser um texto")
    .trim()
    .isLength({ min: 1 })
    .withMessage("O nome não pode estar vazio"),
  check("cnpj")
    .notEmpty()
    .withMessage("É obrigatório informar o CNPJ")
    .isString()
    .withMessage("O CNPJ deve ser um texto")
    .matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$|^\d{14}$/)
    .withMessage(
      "CNPJ inválido. Use o formato 00.000.000/0000-00 ou 14 dígitos"
    ),
  check("cep")
    .optional()
    .isString()
    .withMessage("O CEP deve ser um texto")
    .matches(/^\d{5}-?\d{3}$/)
    .withMessage("CEP inválido. Use o formato 00000-000 ou 00000000"),
  check("rua").optional().isString().withMessage("A rua deve ser um texto"),
  check("cidade")
    .optional()
    .isString()
    .withMessage("A cidade deve ser um texto"),
  check("estado")
    .optional()
    .isString()
    .withMessage("O estado deve ser um texto")
    .isLength({ max: 2 })
    .withMessage("O estado deve ter no máximo 2 caracteres"),
  check("numero")
    .optional()
    .isString()
    .withMessage("O número deve ser um texto"),
  check("email").optional().isEmail().withMessage("Email inválido"),
  check("telefone")
    .optional()
    .isString()
    .withMessage("O telefone deve ser um texto")
    .matches(/^\(\d{2}\)\s?\d{4,5}-?\d{4}$|^\d{10,11}$/)
    .withMessage(
      "Telefone inválido. Use o formato (00) 00000-0000 ou 11 dígitos"
    ),
];
