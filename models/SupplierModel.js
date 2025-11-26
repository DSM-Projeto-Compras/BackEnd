import prisma from "../utils/database.js";

const Supplier = {
  async find() {
    return await prisma.supplier.findMany({
      orderBy: {
        dataCriacao: "desc",
      },
    });
  },

  async findById(id) {
    return await prisma.supplier.findUnique({
      where: { id },
    });
  },

  async findByCnpj(cnpj) {
    return await prisma.supplier.findUnique({
      where: { cnpj },
    });
  },

  async create(data) {
    return await prisma.supplier.create({
      data,
    });
  },

  async findByIdAndUpdate(id, data) {
    return await prisma.supplier.update({
      where: { id },
      data,
    });
  },

  async findByIdAndDelete(id) {
    return await prisma.supplier.delete({
      where: { id },
    });
  },
};

export default Supplier;
