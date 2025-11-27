import { validationResult } from "express-validator";
import Product from "../models/ProductModel.js";

import { logInfo, logError } from "../logger.js";

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({
      message: "Erro ao obter a listagem dos produtos",
      error: err.message,
    });
  }
};

export const getProductByUserId = async (req, res) => {
  try {
    const userId = req.user.id;
    const products = await Product.find({ userId });
    if (!products) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }
    res.status(200).json(products);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Erro ao obter o produto pelo ID", error: err.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { quantidade, descricao, cod_id, grupo, classe, material, elemento, natureza, ...outrasProps } = req.body;
    const userId = req.user.id;
    const justificativa = "";
    const descricaoTratada = descricao ?? "";

    const productData = {
      quantidade: parseInt(quantidade),
      justificativa: justificativa,
      userId,
      descricao: descricaoTratada,
      cod_id: cod_id ?? null,
      grupo: grupo ?? null,
      classe: classe ?? null,
      material: material ?? null,
      elemento: elemento ?? null,
      natureza: natureza ?? null,
      ...outrasProps,
    };

    const savedProduct = await Product.create(productData);

    //salvando o log de sucesso no mysql
    await logInfo("Produto criado com sucesso", req, {
      body: req.body,
      user: req.user?.id,
    });
    res.status(201).json(savedProduct);
  } catch (err) {
    await logError("Erro ao criar produto", req, err, {
      body: req.body,
      user: req.user?.id,
    });
    res.status(500).json({ message: "Erro no servidor", error: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  
  try {
    console.log("params id: ", req.params.id)
    console.log("produto:", await Product.findById(req.params.id))
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    if (product.userId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Você não tem permissão para excluir este produto" });
    }
    if (product.status !== "Pendente") {
      return res.status(403).json({
        message: "Só é permitido excluir produtos com status Pendente",
      });
    }

    const result = await Product.findByIdAndDelete(productId);
    res.status(200).json(result);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Erro ao excluir o produto", error: err.message });
  }
};

export const updateProduct = async (req, res) => {
  const idDocumento = req.body.id;
  delete req.body.id;

  try {
    const product = await Product.findById(idDocumento);
    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }
    if (req.body.status != null) {
      if (product.status != req.body.status) {
        await logError("Tentativa de atualização de status do produto", req, {
          body: req.body,
          user: req.user?.id,
        });
        return res.status(403).json({
          message: "Você não tem permissão para atualizar os status do produto",
        });
      }
    }
    if (product.userId !== req.user.id) {
      await logError("Usuário não autorizado a atualizar o produto", req, {
        body: req.body,
        user: req.user?.id,
      });
      return res.status(403).json({
        message: "Você não tem permissão para atualizar este produto",
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      idDocumento,
      req.body
    );
    await logInfo("Produto atualizado com sucesso", req, {
      body: req.body,
      user: req.user?.id,
    });
    res.status(202).json(updatedProduct);
  } catch (err) {
    await logError("Erro ao atualizar produto", req, err, {
      body: req.body,
      user: req.user?.id,
    });
    res.status(500).json({ message: "Erro no servidor", error: err.message });
  }
};

export const updateProductStatus = async (req, res) => {
  try {
    const productId = req.params.id;
    const { status, justificativa } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    if (product.status !== "Pendente") {
      return res.status(400).json({
        message: 'O status só pode ser alterado se estiver "Pendente".',
      });
    }

    if (!["Aprovado", "Negado"].includes(status)) {
      return res
        .status(400)
        .json({ message: 'Status inválido. Utilize "Aprovado" ou "Negado".' });
    }
    const updateData = { status };
    if (status === "Negado") {
      updateData.justificativa = justificativa || "";
    } else {
      updateData.justificativa = null;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData
    );
    await logInfo("Status do produto atualizado com sucesso", req, {
      body: req.body,
      user: req.user?.id,
    });
    res.status(200).json({
      message: "Status do produto atualizado com sucesso",
      product: updatedProduct,
    });
  } catch (err) {
    await logError("Erro ao atualizar status do produto", req, err, {
      body: req.body,
      user: req.user?.id,
    });
    res.status(500).json({
      message: "Erro ao atualizar o status do produto",
      error: err.message,
    });
  }
};

// Marcar produto como Realizado (com fornecedor)
export const markAsRealized = async (req, res) => {
  try {
    const productId = req.params.id;
    const { supplierId } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    if (product.status !== "Aprovado") {
      return res.status(400).json({
        message:
          'O produto deve estar com status "Aprovado" para ser marcado como Realizado.',
      });
    }

    if (!supplierId) {
      return res.status(400).json({
        message: "É necessário informar um fornecedor.",
      });
    }

    const updateData = {
      status: "Realizado",
      supplierId: supplierId,
    };

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData
    );

    await logInfo("Produto marcado como Realizado", req, {
      productId,
      supplierId,
      user: req.user?.id,
    });

    res.status(200).json({
      message: "Produto marcado como Realizado com sucesso",
      product: updatedProduct,
    });
  } catch (err) {
    await logError("Erro ao marcar produto como Realizado", req, err, {
      productId: req.params.id,
      user: req.user?.id,
    });
    res.status(500).json({
      message: "Erro ao marcar produto como Realizado",
      error: err.message,
    });
  }
};

// Marcar produto como Entregue
export const markAsDelivered = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    if (product.status !== "Realizado") {
      return res.status(400).json({
        message:
          'O produto deve estar com status "Realizado" para ser marcado como Entregue.',
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(productId, {
      status: "Entregue",
    });

    await logInfo("Produto marcado como Entregue", req, {
      productId,
      user: req.user?.id,
    });

    res.status(200).json({
      message: "Produto marcado como Entregue com sucesso",
      product: updatedProduct,
    });
  } catch (err) {
    await logError("Erro ao marcar produto como Entregue", req, err, {
      productId: req.params.id,
      user: req.user?.id,
    });
    res.status(500).json({
      message: "Erro ao marcar produto como Entregue",
      error: err.message,
    });
  }
};

// Marcar produto como Finalizado
export const markAsFinalized = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    if (product.status !== "Entregue") {
      return res.status(400).json({
        message:
          'O produto deve estar com status "Entregue" para ser marcado como Finalizado.',
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(productId, {
      status: "Finalizado",
    });

    await logInfo("Produto marcado como Finalizado", req, {
      productId,
      user: req.user?.id,
    });

    res.status(200).json({
      message: "Produto marcado como Finalizado com sucesso",
      product: updatedProduct,
    });
  } catch (err) {
    await logError("Erro ao marcar produto como Finalizado", req, err, {
      productId: req.params.id,
      user: req.user?.id,
    });
    res.status(500).json({
      message: "Erro ao marcar produto como Finalizado",
      error: err.message,
    });
  }
};

// Voltar status do produto (ex: de Entregue para Realizado)
export const revertProductStatus = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    let newStatus;
    switch (product.status) {
      case "Realizado":
        newStatus = "Aprovado";
        break;
      case "Entregue":
        newStatus = "Realizado";
        break;
      case "Finalizado":
        newStatus = "Entregue";
        break;
      default:
        return res.status(400).json({
          message: "Não é possível reverter o status deste produto.",
        });
    }

    const updatedProduct = await Product.findByIdAndUpdate(productId, {
      status: newStatus,
    });

    await logInfo(
      `Produto revertido de ${product.status} para ${newStatus}`,
      req,
      {
        productId,
        oldStatus: product.status,
        newStatus,
        user: req.user?.id,
      }
    );

    res.status(200).json({
      message: `Status revertido de ${product.status} para ${newStatus} com sucesso`,
      product: updatedProduct,
    });
  } catch (err) {
    await logError("Erro ao reverter status do produto", req, err, {
      productId: req.params.id,
      user: req.user?.id,
    });
    res.status(500).json({
      message: "Erro ao reverter status do produto",
      error: err.message,
    });
  }
};
