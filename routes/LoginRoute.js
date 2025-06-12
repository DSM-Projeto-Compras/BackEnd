import express from "express";
import {
  register,
  login,
  registerAdmin,
  deleteUser,
} from "../controllers/LoginController.js";
import {
  validaCadastro,
  validaLogin,
  validaCadastroAdmin,
  validaDeleteUser,
} from "../validators/LoginValidator.js";
import authAdmin from "../middlewares/authAdmin.js";

const router = express.Router();

router.post("/cadastro", validaCadastro, register);
router.post("/", validaLogin, login);
router.post("/cadastro-admin", authAdmin, validaCadastroAdmin, registerAdmin);
router.delete("/usuario/:id", authAdmin, validaDeleteUser, deleteUser);

export default router;
