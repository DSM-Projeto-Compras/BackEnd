import express from "express";
import {
  register,
  login,
  registerAdmin,
  deleteUser,
  forgotPassword,
  verifyCode,
  resetPassword,
  getAdmins,
  getMe,
} from "../controllers/LoginController.js";
import {
  validaCadastro,
  validaLogin,
  validaCadastroAdmin,
  validaDeleteUser,
  validaForgotPassword,
  validaVerifyCode,
  validaResetPassword,
} from "../validators/LoginValidator.js";
import authAdmin from "../middlewares/authAdmin.js";

const router = express.Router();

<<<<<<< feat/get-admin
router.get("/", authAdmin, getAdmins);
router.get("/me", authAdmin, getMe);
=======
/* 
 * #swagger.tags = ['CRUD de Usuários']
  * #swagger.summary = 'Rota para cadastro e login de usuários'
 */
>>>>>>> master
router.post("/cadastro", validaCadastro, register);
router.post("/", validaLogin, login);
router.post("/cadastro-admin", authAdmin, validaCadastroAdmin, registerAdmin);
router.delete("/usuario/:id", authAdmin, validaDeleteUser, deleteUser);
router.post("/forgot", validaForgotPassword, forgotPassword);
router.post("/verify", validaVerifyCode, verifyCode);
router.patch("/reset", validaResetPassword, resetPassword);

export default router;
