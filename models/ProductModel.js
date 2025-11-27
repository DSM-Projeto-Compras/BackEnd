import prisma from "../utils/database.js";

// Product model usando Prisma Client
const Product = {
  // Criar produto
  async create(productData) {
    return await prisma.product.create({
      data: productData
    });
  },

  // Buscar produtos com opções de filtro
  async find(where = {}) {
    return await prisma.product.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            nome: true
          }
        },
        supplier: {
          select: {
            id: true,
            nome: true,
            cnpj: true,
            ativado: true
          }
        }
      }
    });
  },

  // Buscar produto por ID
  async findById(id) {
    return await prisma.product.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            nome: true
          }
        },
        supplier: {
          select: {
            id: true,
            nome: true,
            cnpj: true,
            ativado: true
          }
        }
      }
    });
  },

  // Atualizar produto
  async findByIdAndUpdate(id, updateData) {
    return await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            nome: true
          }
        },
        supplier: {
          select: {
            id: true,
            nome: true,
            cnpj: true,
            ativado: true
          }
        }
      }
    });
  },

  // Deletar produto
  async findByIdAndDelete(id) {
    return await prisma.product.delete({
      where: { id }
    });
  },

  // Buscar produtos com populate (compatibilidade)
  async findWithPopulate(where = {}) {
    return await prisma.product.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            nome: true
          }
        },
        supplier: {
          select: {
            id: true,
            nome: true,
            cnpj: true,
            ativado: true
          }
        }
      }
    });
  },

  // Salvar (compatibilidade com código existente)
  async save() {
    if (this.id) {
      return await prisma.product.update({
        where: { id: this.id },
        data: this
      });
    } else {
      return await prisma.product.create({
        data: this
      });
    }
  }
};

export default Product;
