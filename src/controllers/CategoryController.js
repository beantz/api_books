import Category from '../models/Categories.js';
import { validationResult } from 'express-validator';

class CategoryController {

  async index(req, res) {
    try {
      // Busca apenas os dados básicos das categorias
      const categorias = await Category.find({})
        .select('_id nome createdAt updatedAt') // Seleciona apenas estes campos
        .sort({ nome: 1 }) // Ordena por nome (A-Z)
        .lean(); // Converte para objeto JavaScript puro
  
      // Formata a resposta
      const response = categorias.map(categoria => ({
        id: categoria._id,
        nome: categoria.nome,
        criada_em: categoria.createdAt,
        atualizada_em: categoria.updatedAt
      }));
  
      return res.status(200).json({
        success: true,
        count: categorias.length,
        data: response
      });
  
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      return res.status(500).json({
        success: false,
        message: "Erro interno ao listar categorias",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  async store(req, res) {
    // Validação dos dados
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map(e => ({
          field: e.param,
          message: e.msg
        }))
      });
    }
  
    const { nome } = req.body;
  
    try {
      // Verifica se a categoria já existe
      const categoriaExistente = await Category.findOne({ nome });
      if (categoriaExistente) {
        return res.status(409).json({
          success: false,
          message: "Esta categoria já está cadastrada"
        });
      }
  
      // Cria a nova categoria
      const newCategory = await Category.create({
        nome,
        livros_id: [] // Inicializa vazio (será preenchido quando livros forem associados)
      });
  
      return res.status(201).json({
        success: true,
        message: "Categoria cadastrada com sucesso!",
        category: {
          id: newCategory._id,
          nome: newCategory.nome,
          criadoEm: newCategory.createdAt
        }
      });
  
    } catch (error) {
      console.error("Erro ao cadastrar categoria:", error);
      return res.status(500).json({
        success: false,
        message: "Erro interno no servidor",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

}

export default new CategoryController();