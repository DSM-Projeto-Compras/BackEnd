import jwt from "jsonwebtoken";

const authAdmin = (req, res, next) => {
  let token = req.header("access-token");

  if (!token && req.header("authorization")) {
    const authHeader = req.header("authorization");
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "Acesso negado. Nenhum token fornecido." });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log("Decoded JWT:", decoded);

    // ✅ Armazena o payload do token no req.user
    req.user = decoded;
    if (decoded.cargo && decoded.cargo !== "admin") {
      return res
        .status(403)
        .json({
          message: "Acesso negado. Apenas administradores podem acessar esta rota.",
        });
    }

    next();
  } catch (err) {
    console.error("Erro no authAdmin:", err);
    res.status(400).json({ message: "Token inválido." });
  }
};

export default authAdmin;
