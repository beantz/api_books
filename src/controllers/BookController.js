import { validationResult } from "express-validator";
import Book from '../models/Book.js';
import Category from '../models/Categories.js';
import Review from '../models/Review.js';
import multer from 'multer';
import crypto from 'crypto';

class BookController {

  async index(req, res) {
    try {
      // Busca todos os livros, populando os dados relacionados
      const books = await Book.find()
        .populate('user_id', 'nome email') // Popula apenas nome e email do usuário
        .populate('categoria_id', 'nome')  // Popula apenas o nome da categoria
        .populate({path: 'review',  // Campo a ser populado
          options: { justOne: true }})                 // Popula todas as reviews
        .sort({ createdAt: -1 });          // Ordena do mais recente para o mais antigo

      // Formata a resposta para evitar vazamento de dados sensíveis
      const formattedBooks = books.map(book => ({
        id: book._id,
        titulo: book.titulo,
        autor: book.autor,
        preco: book.preco,
        estado: book.estado,
        descricao: book.descricao,
        imagem: {
          url: book.imagem?.url,
          filename: book.imagem?.filename
        },
        vendedor: {
          id: book.user_id?._id,
          nome: book.user_id?.nome,
          email: book.user_id?.email
        },
        categorias: book.categoria_id?.map(cat => ({
          id: cat._id,
          nome: cat.nome
        })),
        reviews: book.review,
        criadoEm: book.createdAt
      }));

      return res.status(200).json({
        success: true,
        books: formattedBooks
      });

    } catch (error) {
      console.error("Erro ao buscar livros:", error);
      return res.status(500).json({
        success: false,
        message: "Erro interno no servidor",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  async store(req, res) {
    // Validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
  
    const { titulo, autor, preco, estado, descricao, categoria_id } = req.body;
    const imagem = req.file; // Arquivo recebido pelo multer
  
    try {
      // Busca a categoria
      const nomeCategoria = await Category.findOne({ nome: categoria_id });
      const todasCategorias = await Category.find({});
  
      if (!nomeCategoria) {
        return res.status(400).json({
          success: false,
          message: `Categoria de nome: "${categoria_id}" não encontrada.`,
          categorias_disponiveis: todasCategorias.map(c => c.nome)
        });
      }
  
      // URL de acesso à imagem
      const baseUrl = process.env.BASE_URL || 'http://192.168.0.105:3000';
      //const imageUrl = imagem ? `${baseUrl}/uploads/${imagem.filename}` : null;
      const imageUrl = imagem ? `${baseUrl}/uploads/${imagem.filename}`.replace(/\\/g, '/') : null;
  
      if (!imagem) {
        return res.status(400).json({
          success: false,
          message: "A imagem é obrigatória"
        });
      }      

      // Cria o livro com os dados e a imagem
      const newBook = await Book.create({
        titulo,
        autor,
        preco: parseFloat(preco),
        estado,
        descricao,
        user_id: req.userId,
        categoria_id: nomeCategoria._id,
        imagem: {
          url: imageUrl,
          filename: imagem.filename
        }
      });
  
      // Atualiza a categoria com o novo livro
      await Category.findByIdAndUpdate(
        nomeCategoria._id,
        { $push: { livros_id: newBook._id } }
      );
  
      // Popula os dados para retorno
      const populatedBook = await Book.findById(newBook._id)
        .populate('user_id', 'nome email')
        .populate('categoria_id', 'nome');
  
      return res.status(201).json({
        success: true,
        message: "Livro cadastrado com sucesso!",
        book: {
          id: populatedBook._id,
          titulo: populatedBook.titulo,
          imagem: populatedBook.imagem?.url,
          vendedor: {
            id: populatedBook.user_id?._id,
            nome: populatedBook.user_id?.nome
          },
          categoria: {
            id: populatedBook.categoria_id?._id,
            nome: populatedBook.categoria_id?.nome
          }
        }
      });
  
    } catch (error) {
      console.error("Erro ao cadastrar livro:", error);
      return res.status(500).json({
        success: false,
        message: "Erro interno no servidor",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};

export default new BookController();