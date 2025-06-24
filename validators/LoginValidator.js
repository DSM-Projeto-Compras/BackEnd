import { check, param } from "express-validator";
import User from "../models/LoginModel.js";

export const validaLogin = [
  check("email")
    .notEmpty()
    .withMessage("O email é obrigatório")
    .isEmail()
    .withMessage("O email informado não é válido"),
  check("senha")
    .notEmpty()
    .withMessage("A senha é obrigatória")
    .isLength({ min: 6 })
    .withMessage("A senha deve ter pelo menos 6 caracteres"),
];

export const validaCadastro = [
  check("nome").notEmpty().withMessage("O nome é obrigatório"),
  check("email")
    .notEmpty()
    .withMessage("O email é obrigatório")
    .isEmail()
    .withMessage("O email informado não é válido")
    .custom(async (email) => {
      const usuarioExistente = await User.findOne({ email });
      if (usuarioExistente) {
        throw new Error("O email informado já está cadastrado");
      }
    }),
  check("senha")
    .notEmpty()
    .withMessage("A senha é obrigatória")
    .isLength({ min: 6 })
    .withMessage("A senha deve ter pelo menos 6 caracteres"),
];

export const validaCadastroAdmin = [
  check("nome").notEmpty().withMessage("O nome é obrigatório"),
  check("email")
    .notEmpty()
    .withMessage("O email é obrigatório")
    .isEmail()
    .withMessage("O email informado não é válido")
    .custom(async (email) => {
      const usuarioExistente = await User.findOne({ email });
      if (usuarioExistente) {
        throw new Error("O email informado já está cadastrado");
      }
    }),
  check("senha")
    .notEmpty()
    .withMessage("A senha é obrigatória")
    .isLength({ min: 6 })
    .withMessage("A senha deve ter pelo menos 6 caracteres"),
];

export const validaDeleteUser = [
  param("id").isMongoId().withMessage("ID do usuário inválido"),
];

export const validaForgotPassword = [
  check("email")
    .notEmpty()
    .withMessage("O email é obrigatório")
    .isEmail()
    .withMessage("O email informado não é válido"),
];

export const validaVerifyCode = [
  check("email")
    .notEmpty()
    .withMessage("O email é obrigatório")
    .isEmail()
    .withMessage("O email informado não é válido"),
  check("codigo")
    .notEmpty()
    .withMessage("O código é obrigatório")
    .isLength({ min: 6, max: 6 })
    .withMessage("O código deve ter exatamente 6 dígitos")
    .isNumeric()
    .withMessage("O código deve conter apenas números"),
];

export const validaResetPassword = [
  check("email")
    .notEmpty()
    .withMessage("O email é obrigatório")
    .isEmail()
    .withMessage("O email informado não é válido"),
  check("codigo")
    .notEmpty()
    .withMessage("O código é obrigatório")
    .isLength({ min: 6, max: 6 })
    .withMessage("O código deve ter exatamente 6 dígitos")
    .isNumeric()
    .withMessage("O código deve conter apenas números"),
  check("novaSenha")
    .notEmpty()
    .withMessage("A nova senha é obrigatória")
    .isLength({ min: 6 })
    .withMessage("A nova senha deve ter pelo menos 6 caracteres"),
];
