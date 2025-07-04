import { validationResult } from "express-validator";
import Book from '../models/Book.js';
import Category from '../models/Categories.js';
import Review from '../models/Review.js';
import path from 'path';
import fs from 'fs';


class BookController {

  async index(req, res) {
    try {
      const books = await Book.find()
        .populate('user_id', 'nome email') 
        .populate('categoria_id', 'nome')  
        .populate({path: 'review', 
          options: { justOne: true }})                
        .sort({ createdAt: -1 });        

      //formata a resposta para evitar vazamento de dados sensíveis
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
    
    try {
      const { titulo, autor, preco, estado, descricao, categoria_id } = req.body;
      const file = req.file;

      if (!file) {
        return res.status(400).json({
          success: false,
          message: "Nenhuma imagem foi enviada"
        });
      }

      console.log('Buscando categoria:', categoria_id);
      const nomeCategoria = await Category.findOne({ nome: categoria_id });

      const imageBuffer = file.buffer;
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const filename = `livro-${uniqueSuffix}.jpg`; 
      const filePath = path.join('uploads', filename);

      const fs = await import('fs');
      if (!fs.existsSync('uploads')) {
        fs.mkdirSync('uploads', { recursive: true });
      }

      await fs.promises.writeFile(filePath, imageBuffer);

      const baseUrl = process.env.BASE_URL || 'http://192.168.0.105:3000';
      const imageUrl = `http://${baseUrl}/uploads/${encodeURIComponent(filename)}`;

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
          filename: filename
        }
      });

      await Category.findByIdAndUpdate(
        nomeCategoria._id,
        { $push: { livros_id: newBook._id } }
      );

      console.log(newBook);
      
      return res.status(201).json({
        success: true,
        message: "Livro cadastrado com sucesso!"
      });

    } catch (error) {
      console.error("Erro:", error.message);
      
      return res.status(500).json({
        success: false,
        message: "Erro interno no servidor"
      });
    }
  }

  async delete(req, res) {
    const { id } = req.params;
    const userId = req.userId; 

    console.log(req.userId);
  
    try {
     
      const book = await Book.findById(id);
      
      if (!book) {
        return res.status(404).json({
          success: false,
          message: "Livro não encontrado"
        });
      }
  
      if (book.user_id.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: "Você não tem permissão para deletar este livro"
        });
      }
  
      await Category.findByIdAndUpdate(
        book.categoria_id,
        { $pull: { livros_id: book._id } }
      );
  
      await Review.deleteMany({ livro_id: book._id });
  
      await Book.findByIdAndDelete(id);
  
      return res.status(200).json({
        success: true,
        message: "Livro deletado com sucesso"
      });
  
    } catch (error) {
      console.error("Erro ao deletar livro:", error);
      return res.status(500).json({
        success: false,
        message: "Erro interno no servidor",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  async findByIdUser(req, res) {
    const { id_usuario } = req.params;
  
    try {
      const books = await Book.find({ user_id: id_usuario })
        .populate('categoria_id', 'nome')        

      //formata a resposta para evitar vazamento de dados sensíveis
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
        categorias: book.categoria_id?.map(cat => ({
          id: cat._id,
          nome: cat.nome
        })),
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

  async getBookById(req, res) {
    try {
      const { id } = req.params;

      const livro = await Book.findById(id)
        .populate({
          path: 'user_id',
          select: 'nome contato'
        })
        .populate({
          path: 'categoria_id',
          select: 'nome'
        });

      if (!livro) {
        return res.status(404).json({
          success: false,
          message: 'Livro não encontrado'
        });
      }

      const response = {
        success: true,
        livro: {
          id: livro._id,
          titulo: livro.titulo,
          autor: livro.autor,
          preco: livro.preco,
          estado: livro.estado,
          descricao: livro.descricao,
          imagem: livro.imagem,
          categorias: livro.categoria_id.map(cat => cat.nome),
          vendedor: {
            id: livro.user_id._id, 
            nome: livro.user_id.nome,
            contato: livro.user_id.contato
          },
          createdAt: livro.createdAt
        }
      };

      res.json(response);

    } catch (error) {
      console.error('Erro ao buscar livro:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar livro',
        error: error.message
      });
    }
  }
}

export default new BookController();