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

    const tokenPayload = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      cargo: usuario.cargo,
      dataCriacao: usuario.dataCriacao,
    };
    console.log(">>> tokenPayload to sign:", tokenPayload);

    jwt.sign(tokenPayload, process.env.SECRET_KEY, { expiresIn: process.env.EXPIRES_IN }, (err, token) => {
      if (err) throw err;
      console.log(">>> signed token:", token);
      res.status(200).json({ access_token: token, cargo: usuario.cargo });
    });
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

    const requesterDate = req.user && req.user.dataCriacao ? new Date(req.user.dataCriacao).getTime() : null;
    const targetDate = usuarioADeletar && usuarioADeletar.dataCriacao ? new Date(usuarioADeletar.dataCriacao).getTime() : null;

    if (requesterDate === null || isNaN(requesterDate) || targetDate === null || isNaN(targetDate)) {
      return res.status(400).json({ message: "Dados de criação não disponíveis para verificação." });
    }

    if (requesterDate > targetDate) {
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

export const changePassword = async (req, res) => {
  console.log("Usuário autenticado:", req.user);
  try {
    const { senhaAtual, novaSenha, confirmaNovaSenha } = req.body;

    if (!senhaAtual || !novaSenha || !confirmaNovaSenha) {
      return res.status(400).json({ message: "Preencha todos os campos." });
    }

    if (novaSenha !== confirmaNovaSenha) {
      return res.status(400).json({ message: "As senhas não coincidem." });
    }

    const usuario = await User.findById(req.user.id);

    const senhaCorreta = await bcrypt.compare(senhaAtual, usuario.senha);
    if (!senhaCorreta) {
      return res.status(403).json({ message: "Senha atual incorreta." });
    }

    const senhaCriptografada = await bcrypt.hash(novaSenha, 10);
    await User.findByIdAndUpdate(usuario.id, { senha: senhaCriptografada });

    res.status(200).json({ message: "Senha alterada com sucesso!" });
  } catch (err) {
    res.status(500).json({ message: `Erro ao alterar senha: ${err.message}` });
  }
};

export const getMe = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      // Se o middleware falhou em injetar o usuário, retorna 401 ou 403
      return res.status(401).json({ message: "Acesso não autorizado: Token inválido ou ausente." });
    }

    const usuario = await User.findById(req.user.id);

    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }
    
    // Remove senha do resultado
    const userObject = usuario.toJSON ? usuario.toJSON() : usuario;
    const { senha, ...usuarioWithoutPassword } = userObject;
    res.status(200).json(usuarioWithoutPassword);
  } catch (err) {
    console.error("Erro no server ao buscar /getme:", err.message)
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
