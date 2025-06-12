import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  cargo: { type: String, enum: ["user", "admin"], default: "user" },
  dataCriacao: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
