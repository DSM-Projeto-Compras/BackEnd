import prisma from "../utils/database.js";

export async function saveLog(log) {
  const { level, message, route, ...extra } = log;
  try {
    await prisma.log.create({
      data: {
        level,
        message,
        route,
        extra: JSON.stringify(extra),
      },
    });
  } catch (error) {
    console.error("Erro ao salvar log:", error);
  }
}

export async function getLogs(req, res) {
  try {
    const logs = await prisma.log.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json(logs);
  } catch (error) {
    console.error("Erro ao obter logs:", error);
    res.status(500).send({
      error: "Erro ao obter logs",
    });
  }
}

export async function getLogById(req, res) {
  const { id } = req.params;
  try {
    const log = await prisma.log.findUnique({
      where: { id: parseInt(id) },
    });

    if (!log) {
      return res.status(404).send({
        error: "Log não encontrado",
      });
    }
    res.json(log);
  } catch (error) {
    console.error("Erro ao obter log:", error);
    res.status(500).send({
      error: "Erro ao obter log",
    });
  }
}

export async function getLogsByDate(req, res) {
  const { data_inicial, data_final } = req.query;
  try {
    const logs = await prisma.log.findMany({
      where: {
        createdAt: {
          gte: new Date(data_inicial),
          lte: new Date(data_final),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json(logs);
  } catch (error) {
    console.error("Erro ao obter logs por data:", error);
    res.status(500).send({
      error: "Erro ao obter logs por data",
    });
  }
}

export async function deleteLog(req, res) {
  const { id } = req.params;
  try {
    const deletedLog = await prisma.log.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).send({ message: "Log deletado com sucesso" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).send({
        error: "Log não encontrado",
      });
    }
    console.error("Erro ao deletar log:", error);
    res.status(500).send({
      error: "Erro ao deletar log",
    });
  }
}
