import { validationResult } from 'express-validator';
import Product from '../models/ProductModel.js';

// import { logInfo, logError } from '../logger.js';

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('userId', 'nome')
      .exec();

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao obter a listagem dos produtos', error: err.message });
  }
};

export const getProductByUserId = async (req, res) => {
  try {
    const userId = req.user.userId;
    const products = await Product.find({ userId });
    if (!products) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao obter o produto pelo ID', error: err.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { quantidade, descricao, ...outrasProps } = req.body;
    const userId = req.user.userId;
    const justificativa = '';
    const descricaoTratada = descricao ?? '';

    const product = new Product({
      quantidade: parseInt(quantidade),
      justificativa: justificativa,
      userId,
      descricao: descricaoTratada,
      ...outrasProps
    });

    await product.save();

    // //salvando o log de sucesso no mysql
    // await logInfo('Produto criado com sucesso', req, { body: req.body, user: req.user?.id});
    // res.status(201).json(product);
  } catch (err) {
    // await logError('Erro ao criar produto', req, err, { body: req.body, user: req.user?.id });
    res.status(500).json({ message: 'Erro no servidor', error: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    if (product.userId.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ message: 'Você não tem permissão para excluir este produto' });
    }
    if (product.status !== 'Pendente') {
      return res.status(403).json({ message: 'Só é permitido excluir produtos com status Pendente' });
    }

    const result = await Product.findByIdAndDelete(productId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao excluir o produto', error: err.message });
  }
};

export const updateProduct = async (req, res) => {
  const idDocumento = req.body._id;
  delete req.body._id;

  try {
    const product = await Product.findById(idDocumento);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    if (req.body.status != null){
      if (product.status != req.body.status) {
        // await logError('Tentativa de atualização de status do produto', req, { body: req.body, user: req.user?.id });
        return res.status(403).json({ message: 'Você não tem permissão para atualizar os status do produto' });
      }
    }
    if (product.userId.toString() !== req.user.userId.toString()) {
      // await logError('Usuário não autorizado a atualizar o produto', req, { body: req.body, user: req.user?.id });
      return res.status(403).json({ message: 'Você não tem permissão para atualizar este produto' });
    }

    await Product.findByIdAndUpdate(idDocumento, req.body, { new: true });
    // await logInfo('Produto atualizado com sucesso', req, { body: req.body, user: req.user?.id });
    res.status(202).json(product);
  } catch (err) {
    // await logError('Erro ao atualizar produto', req, err, { body: req.body, user: req.user?.id });
    res.status(500).json({ message: 'Erro no servidor', error: err.message });
  }
};

export const updateProductStatus = async (req, res) => {
  try {
    const productId = req.params.id;
    const { status, justificativa } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    if (product.status !== 'Pendente') {
      return res.status(400).json({ message: 'O status só pode ser alterado se estiver "Pendente".' });
    }

    if (!['Aprovado', 'Negado'].includes(status)) {
      return res.status(400).json({ message: 'Status inválido. Utilize "Aprovado" ou "Negado".' });
    }
    product.status = status;

    if (status === 'Negado') {
      product.justificativa = justificativa || '';
    } else {
      product.justificativa = undefined;
    }

    await product.save();
    // await logInfo('Status do produto atualizado com sucesso', req, { body: req.body, user: req.user?.id });
    res.status(200).json({ message: 'Status do produto atualizado com sucesso', product });
  } catch (err) {
    // await logError('Erro ao atualizar status do produto', req, err, { body: req.body, user: req.user?.id });
    res.status(500).json({ message: 'Erro ao atualizar o status do produto', error: err.message });
  }
};