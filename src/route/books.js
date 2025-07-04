import bookController from '../controllers/BookController.js';
import { verifyJWT } from '../middleware/authJwt.js';
import express from 'express';
import validationBooks from '../request/validationBooks.js';
import { upload } from '../config/multerConfig.js'; 

const booksRouter = express.Router();

booksRouter
    .get('/livros', (req, res) => bookController.index(req, res))
    .get('/livros/:id', (req, res) => bookController.getBookById(req, res))
    .get('/livros/meus_livros/:id_usuario', (req, res) => bookController.findByIdUser(req, res))
    .post('/livros/cadastrar' ,verifyJWT, upload.single('imagem') ,validationBooks, (req, res) => bookController.store(req, res))
    .delete('/livros/deletar/:id', verifyJWT,(req, res) => bookController.delete(req, res))

export default booksRouter;