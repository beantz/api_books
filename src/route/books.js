import livrosController from '../controllers/livrosController.js';
import { verifyJWT } from '../middleware/authJwt.js';
import express from 'express';
import validationBooks from '../request/validationBooks.js';

const livrosRouter = express.Router();

livrosRouter
    .get('/livros', verifyJWT, (req, res) => livrosController.index(req, res))
    .post('/livros/cadastrar' , verifyJWT ,validationBooks, (req, res) => livrosController.store(req, res))

export default livrosRouter;