import { validationResult } from "express-validator";
import Book from '../models/Book.js';


class BookController {

  async index(req, res) {
    try {
      // Busca todos os livros, populando os dados relacionados
      const books = await Book.find()
        .populate('user_id', 'name email') // Popula apenas nome e email do usuário
        .populate('categoria_id', 'nome')  // Popula apenas o nome da categoria
        .populate('review')                // Popula todas as reviews
        .sort({ createdAt: -1 });          // Ordena do mais recente para o mais antigo

      // Formata a resposta para evitar vazamento de dados sensíveis
      const formattedBooks = books.map(book => ({
        id: book._id,
        titulo: book.titulo,
        autor: book.autor,
        preco: book.preco,
        estado: book.estado,
        descricao: book.descricao,
        vendedor: {
          id: book.user_id?._id,
          nome: book.user_id?.name,
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

    //fazer validação
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

    //registrar no banco
    const { titulo, autor, preco, estado, descricao, user_id, categoria_id } = req.body;

    try {
      const newBook = await Book.create({
        titulo,
        autor,
        preco,
        estado,
        descricao,
        user_id, // ID do usuário/vendedor
        categoria_id // Array de IDs de categorias
    });

      return res.status(201).json({
        success: true,
        message: "Livro cadastrado com sucesso!",
        book: newBook
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

}

export default new BookController();