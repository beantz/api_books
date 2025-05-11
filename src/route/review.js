import reviewController from '../controllers/ReviewController.js';
import express from 'express';
import { verifyJWT } from '../middleware/authJwt.js';

const reviewRouter = express.Router();

reviewRouter
    .get('/Review/:livro_id' , (req, res) => reviewController.getAllReviewsBook(req, res))
    .post('/Review', verifyJWT ,(req, res) => reviewController.store(req, res))

export default reviewRouter;