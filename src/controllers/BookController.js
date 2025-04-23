import { validationResult } from "express-validator";
import Book from '../models/Book.js';
import Category from '../models/Categories.js';
import Review from '../models/Review.js';

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

  //esse metodo aqui ta dando errado
  async store(req, res) {

    //Validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
          success: false,
          errors: errors.array()
      });
    }

    //categoria_id vai ta recebendo o nome
    const { titulo, autor, preco, estado, descricao, categoria_id } = req.body;

    console.log('req', categoria_id);
    try {

      // busca no banco com comparação direta
      const nomeCategoria = await Category.findOne({ nome: categoria_id });
      console.log(nomeCategoria);
      let todasCategorias = await Category.find({});

      if (!nomeCategoria) {
        return res.status(400).json({
          success: false,
          message: `Categoria de nome: "${nomeCategoria}" não encontrada.`,
          categorias_disponiveis: todasCategorias.map(c => c.nome)
        });
      }

      // cria o livro com o ID da categoria
      const newBook = await Book.create({
        titulo,
        autor,
        preco: parseFloat(preco),
        estado,
        descricao,
        user_id: req.userId,
        categoria_id: nomeCategoria._id // Usa o ID real
      });

      // atualiza a categoria com o novo livro (opcional)
      await Category.findByIdAndUpdate(
        nomeCategoria,
        { $push: { livros_id: newBook._id } }
      );

      /* retorna o livro populado (o populate é usado para que quando for dar um retorno da consulta acima, em user_id e categoria_id não seja me retornado apenas od ids que ´e o seria normalmente
      ao inves disso, relacionado ao user_ id e categoria_id vai ser retornado o id com os campos mostrados ai) */
      const populatedBook = await Book.findById(newBook._id)
        .populate('user_id', 'nome email')
        .populate('categoria_id', 'nome');

      return res.status(201).json({
        success: true,
        message: "Livro cadastrado com sucesso!",
        book: {
          id: populatedBook._id,
          titulo: populatedBook.titulo,
          vendedor: {
            id: populatedBook.user_id?._id,
            nome: populatedBook.user_id?.nome
          },
          categoria: { // ✅ Retorna um objeto (não mais array)
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