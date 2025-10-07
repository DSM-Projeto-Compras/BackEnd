import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/LoginModel.js";
import { sendPasswordResetCode } from "../services/EmailService.js";

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(409).json({ errors: errors.array() });
    }

    const { nome, email, senha } = req.body;
    const senhaCriptografada = await bcrypt.hash(senha, 10);
    let cargo = "user";
    const usuario = await User.create({ nome, email, senha: senhaCriptografada, cargo });
    res.status(201).json(usuario);
  } catch (err) {
    res.status(500).json({ message: `${err.message} Erro no server` });
  }
};

export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, senha } = req.body;
    const usuario = await User.findOne({ email });

    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const senhaCorrespondente = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorrespondente) {
      return res.status(403).json({ message: "Senha incorreta" });
    }

    jwt.sign(
      { userId: usuario.id },
      process.env.SECRET_KEY,
      { expiresIn: process.env.EXPIRES_IN },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({ access_token: token, cargo: usuario.cargo });
      }
    );
  } catch (err) {
    res.status(500).json({ message: `${err.message} Erro no server` });
  }
};

export const registerAdmin = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(409).json({ errors: errors.array() });
    }

    const { nome, email, senha } = req.body;
    const senhaCriptografada = await bcrypt.hash(senha, 10);
    const usuario = await User.create({
      nome,
      email,
      senha: senhaCriptografada,
      cargo: "admin",
    });

    const { senha: _, ...usuarioSemSenha } = usuario;
    res.status(201).json(usuarioSemSenha);
  } catch (err) {
    res.status(500).json({ message: `${err.message} Erro no server` });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioADeletar = await User.findById(id);

    if (!usuarioADeletar) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    if (req.user.cargo === "admin" && usuarioADeletar.cargo === "user") {
      return res.status(403).json({
        message: "Admins só podem deletar outros admins",
      });
    }

    if (req.user.id === id) {
      return res
        .status(403)
        .json({ message: "Você não pode deletar sua própria conta" });
    }

    if (req.user.dataCriacao < usuarioADeletar.dataCriacao) {
      return res.status(403).json({
        message: "Você não pode deletar usuários mais antigos que você",
      });
    }

    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "Usuário deletado com sucesso" });
  } catch (err) {
    res.status(500).json({ message: `${err.message} Erro no server` });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;
    const usuario = await User.findOne({ email });

    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const codigo = Math.floor(100000 + Math.random() * 900000).toString();

    const expiracao = new Date(Date.now() + 15 * 60 * 1000);

    await User.findByIdAndUpdate(usuario.id, {
      codigoEmail: codigo,
      codigoExp: expiracao,
    });

    const emailEnviado = await sendPasswordResetCode(email, codigo);

    if (!emailEnviado) {
      return res.status(500).json({ message: "Erro ao enviar email" });
    }

    res.status(200).json({ message: "Código enviado para o email" });
  } catch (err) {
    res.status(500).json({ message: `${err.message} Erro no server` });
  }
};

export const verifyCode = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, codigo } = req.body;
    const usuario = await User.findOne({ email });

    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    if (!usuario.codigoEmail || !usuario.codigoExp) {
      return res.status(400).json({ message: "Nenhum código foi solicitado" });
    }

    if (new Date() > usuario.codigoExp) {
      return res.status(400).json({ message: "Código expirado" });
    }

    if (usuario.codigoEmail !== codigo) {
      return res.status(400).json({ message: "Código inválido" });
    }

    res.status(200).json({ message: "Código verificado com sucesso" });
  } catch (err) {
    res.status(500).json({ message: `${err.message} Erro no server` });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, codigo, novaSenha } = req.body;
    const usuario = await User.findOne({ email });

    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    if (!usuario.codigoEmail || !usuario.codigoExp) {
      return res.status(400).json({ message: "Nenhum código foi solicitado" });
    }

    if (new Date() > usuario.codigoExp) {
      return res.status(400).json({ message: "Código expirado" });
    }

    if (usuario.codigoEmail !== codigo) {
      return res.status(400).json({ message: "Código inválido" });
    }

    const senhaCriptografada = await bcrypt.hash(novaSenha, 10);

    await User.findByIdAndUpdate(usuario.id, {
      senha: senhaCriptografada,
      codigoEmail: null,
      codigoExp: null,
    });

    res.status(200).json({ message: "Senha redefinida com sucesso" });
  } catch (err) {
    res.status(500).json({ message: `${err.message} Erro no server` });
  }
};

export const getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ cargo: "admin" });
    // Remove senha dos resultados
    const adminsWithoutPassword = admins.map(admin => {
      const { senha, ...adminWithoutPassword } = admin;
      return adminWithoutPassword;
    });
    res.status(200).json(adminsWithoutPassword);
  } catch (err) {
    res.status(500).json({ message: `${err.message} Erro no server` });
  }
};

export const getMe = async (req, res) => {
  try {
    const usuario = await User.findById(req.user.userId);

    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }
    
    // Remove senha do resultado
    const { senha, ...usuarioWithoutPassword } = usuario;
    res.status(200).json(usuarioWithoutPassword);
  } catch (err) {
    res.status(500).json({ message: `${err.message} Erro no server` });
  }
};
