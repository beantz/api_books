process.env.TZ = 'UTC'; 

import 'dotenv-safe/config.js';
import express, { Router } from 'express';
import booksRouter from './src/route/books.js';
import loginRouter from './src/route/login.js';
import categoryRouter from './src/route/category.js';
import usersRouter from './src/route/users.js';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import reviewRouter from './src/route/review.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(cors({exposedHeaders: ['Content-Disposition']})); 
app.use(express.json({ limit: '50mb' }));
app.use(loginRouter);
app.use(booksRouter);
app.use(categoryRouter);
app.use(usersRouter);
app.use(reviewRouter);
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')));

app.use((error, req, res, next) => {
  if (error.message === 'Unexpected end of form') {
    return res.status(400).json({
      success: false,
      message: 'Erro no envio da imagem - tente novamente'
    });
  }
  next(error);
});

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("✅ Conectado ao MongoDB Atlas"))
.catch(err => console.error("❌ Erro na conexão:", err));
 
app.listen(3000, () => console.log("Servidor escutando na porta 3000..."));
