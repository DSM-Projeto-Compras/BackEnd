import prisma from "../utils/database.js";

// User model usando Prisma Client
const User = {
  // Criar usuário
  async create(userData) {
    return await prisma.user.create({
      data: userData
    });
  },

  // Buscar usuário por email
  async findOne(where) {
    return await prisma.user.findFirst({
      where
    });
  },

  // Buscar usuário por ID
  async findById(id) {
    return await prisma.user.findUnique({
      where: { id }
    });
  },

  // Atualizar usuário
  async findByIdAndUpdate(id, updateData) {
    return await prisma.user.update({
      where: { id },
      data: updateData
    });
  },

  // Deletar usuário
  async findByIdAndDelete(id) {
    return await prisma.user.delete({
      where: { id }
    });
  },

  // Buscar todos os usuários
  async find(where = {}) {
    return await prisma.user.findMany({
      where
    });
  },

  // Salvar (compatibilidade com código existente)
  async save() {
    if (this.id) {
      return await prisma.user.update({
        where: { id: this.id },
        data: this
      });
    } else {
      return await prisma.user.create({
        data: this
      });
    }
  }
};

export default User;
