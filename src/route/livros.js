import livrosController from '../controllers/livrosController.js';
import { verifyJWT } from '../middleware/authJwt.js';
import express from 'express';

const livrosRouter = express.Router();

livrosRouter
    .get('/livros', verifyJWT, (req, res) => livrosController.index(req, res));

export default livrosRouter;