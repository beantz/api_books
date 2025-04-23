import categoryController from '../controllers/CategoryController.js';
import { verifyJWT } from '../middleware/authJwt.js';
import express from 'express';
import validationCategory from '../request/validationCategory.js';

const categoryRouter = express.Router();

categoryRouter
    .get('/categorias', (req, res) => categoryController.index(req, res))
    .post('/categoria/cadastrar' , verifyJWT , validationCategory, (req, res) => categoryController.store(req, res))

export default categoryRouter;