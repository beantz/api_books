import Review from '../models/Review.js';
import Book from '../models/Book.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

class ReviewController {

  async store(req, res) {
    try {
      const { comentarios, avaliacao, livro_id } = req.body;
      const userId = req.user._id; //obtido do middleware JWT
  
      if (!comentarios || !avaliacao || !livro_id) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios" });
      }

      const livro = await Book.findById(livro_id);
      if (!livro) {
        return res.status(404).json({ error: "Livro não encontrado" });
      }
  
      const review = await Review.create({
        comentarios,
        avaliacao,
        user_id: userId,
        livro_id
      });

      await Book.findByIdAndUpdate(
        livro_id,
        { $push: { review: review._id } },
        { new: true, useFindAndModify: false }
      );
  
      await review.populate('user_id', 'nome');
  
      return res.status(201).json({
        success: true,
        review: {
          _id: review._id,
          comentarios: review.comentarios,
          avaliacao: review.avaliacao,
          user_id: {
            _id: review.user_id._id,
            nome: review.user_id.nome
          }
        }
      });
  
    } catch (error) {
      console.error("Erro ao criar review:", error);
      return res.status(500).json({ error: "Erro interno no servidor" });
    }
  }

  //ver esse metodo que retorna todas as reviews de um determinado livro
  async getAllReviewsBook(req, res) {
    const { livro_id } = req.params;
    console.log('entrou no controller');
    try {
      if (!mongoose.Types.ObjectId.isValid(livro_id)) {
        return res.status(400).json({ // Alterado para usar res.status().json()
          success: false,
          message: 'ID do livro inválido'
        });
      }

      const book = await Book.findById(livro_id)
        .populate({
          path: 'review',
          populate: {
            path: 'user_id',
            select: 'nome'
          }
        });

      if (!book) {
        return res.status(404).json({
          success: false,
          message: 'Livro não encontrado'
        });
      }

      console.log('reviws', book.review);

      // Modifique o retorno para enviar como resposta HTTP
      return res.status(200).json(
        book.review.map(review => ({
          _id: review._id,
          comentario: review.comentarios,
          nota: review.avaliacao,
          usuario: review.user_id?.nome || "Anônimo"
        }))
      );
      
    } catch (error) {
      console.error('Erro ao buscar reviews:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno no servidor'
      });
    }
  }

  async deleteReview(req, res) {
    try {
      const { id } = req.params;
      const userId = req.userId; //obtido do middleware de autenticação
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID da avaliação inválido'
        });
      }
  
      const review = await Review.findById(id);
      
      if (!review) {
        return res.status(404).json({
          success: false,
          message: 'Avaliação não encontrada'
        });
      }
  
      if (review.user_id.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Você não tem permissão para excluir esta avaliação'
        });
      }
  
      await Review.findByIdAndDelete(id);
  
      return res.status(200).json({
        success: true,
        message: 'Avaliação excluída com sucesso'
      });
  
    } catch (error) {
      console.error('Erro ao excluir avaliação:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno no servidor'
      });
    }
  }

}

export default new ReviewController();