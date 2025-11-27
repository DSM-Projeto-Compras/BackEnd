import { validationResult } from "express-validator";
import Supplier from "../models/SupplierModel.js";
import { logInfo, logError } from "../logger.js";

export const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.status(200).json(suppliers);
  } catch (err) {
    res.status(500).json({
      message: "Erro ao obter a listagem dos fornecedores",
      error: err.message,
    });
  }
};

export const getSupplierById = async (req, res) => {
  try {
    const supplierId = req.params.id;
    const supplier = await Supplier.findById(supplierId);

    if (!supplier) {
      return res.status(404).json({ message: "Fornecedor não encontrado" });
    }

    res.status(200).json(supplier);
  } catch (err) {
    res.status(500).json({
      message: "Erro ao obter o fornecedor pelo ID",
      error: err.message,
    });
  }
};

export const createSupplier = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { cnpj, ...rest } = req.body;

    // Verificar se o CNPJ já existe e está ativado
    const existingSupplier = await Supplier.findByCnpj(cnpj);
    if (existingSupplier && existingSupplier.ativado) {
      return res.status(400).json({
        message: "Já existe um fornecedor cadastrado com este CNPJ",
      });
    }

    const supplierData = {
      cnpj,
      ...rest,
    };

    const savedSupplier = await Supplier.create(supplierData);

    await logInfo("Fornecedor criado com sucesso", req, {
      body: req.body,
      user: req.user?.id,
    });

    res.status(201).json(savedSupplier);
  } catch (err) {
    await logError("Erro ao criar fornecedor", req, err, {
      body: req.body,
      user: req.user?.id,
    });
    res.status(500).json({ message: "Erro no servidor", error: err.message });
  }
};

export const updateSupplier = async (req, res) => {
  try {
    const supplierId = req.params.id;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const supplier = await Supplier.findById(supplierId);

    if (!supplier) {
      return res.status(404).json({ message: "Fornecedor não encontrado" });
    }

    // Se o CNPJ está sendo atualizado, verificar se não existe outro fornecedor com o mesmo CNPJ e ativado
    if (req.body.cnpj && req.body.cnpj !== supplier.cnpj) {
      const existingSupplier = await Supplier.findByCnpj(req.body.cnpj);
      if (existingSupplier && existingSupplier.ativado) {
        return res.status(400).json({
          message: "Já existe um fornecedor cadastrado com este CNPJ",
        });
      }
    }

    const updatedSupplier = await Supplier.findByIdAndUpdate(
      supplierId,
      req.body
    );

    await logInfo("Fornecedor atualizado com sucesso", req, {
      body: req.body,
      user: req.user?.id,
    });

    res.status(200).json(updatedSupplier);
  } catch (err) {
    await logError("Erro ao atualizar fornecedor", req, err, {
      body: req.body,
      user: req.user?.id,
    });
    res.status(500).json({ message: "Erro no servidor", error: err.message });
  }
};

export const deleteSupplier = async (req, res) => {
  try {
    const supplierId = req.params.id;
    const supplier = await Supplier.findById(supplierId);

    if (!supplier) {
      return res.status(404).json({ message: "Fornecedor não encontrado" });
    }

    const result = await Supplier.findByIdAndDelete(supplierId);

    await logInfo("Fornecedor desativado com sucesso", req, {
      supplierId,
      user: req.user?.id,
    });

    res.status(200).json({
      message: "Fornecedor desativado com sucesso",
      supplier: result,
    });
  } catch (err) {
    await logError("Erro ao desativar fornecedor", req, err, {
      supplierId: req.params.id,
      user: req.user?.id,
    });
    res.status(500).json({
      message: "Erro ao desativar o fornecedor",
      error: err.message,
    });
  }
};
