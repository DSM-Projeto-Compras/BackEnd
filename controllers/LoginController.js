import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/LoginModel.js";

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(409).json({ errors: errors.array() });
    }

    const { nome, email, senha } = req.body;
    const senhaCriptografada = await bcrypt.hash(senha, 10);
    let cargo = "user";
    const usuario = new User({ nome, email, senha: senhaCriptografada, cargo });
    await usuario.save();
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
      { userId: usuario._id },
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
    const usuario = new User({
      nome,
      email,
      senha: senhaCriptografada,
      cargo: "admin",
    });
    await usuario.save();

    const { senha: _, ...usuarioSemSenha } = usuario.toObject();
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

    if (req.user.dataCriacao > usuarioADeletar.dataCriacao) {
      return res.status(403).json({
        message: "Você não pode deletar usuários mais antigos que você",
      });
    }

    if (req.user._id.toString() === id) {
      return res
        .status(403)
        .json({ message: "Você não pode deletar sua própria conta" });
    }

    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "Usuário deletado com sucesso" });
  } catch (err) {
    res.status(500).json({ message: `${err.message} Erro no server` });
  }
};
