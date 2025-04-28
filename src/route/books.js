import bookController from '../controllers/BookController.js';
import { verifyJWT } from '../middleware/authJwt.js';
import express from 'express';
import validationBooks from '../request/validationBooks.js';
import upload from '../uploads/config.js';

const booksRouter = express.Router();

booksRouter
    .get('/livros', (req, res) => bookController.index(req, res))
    .post('/livros/cadastrar' , verifyJWT, upload.single('imagem') ,validationBooks, (req, res) => bookController.store(req, res))

export default booksRouter;