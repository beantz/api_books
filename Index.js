process.env.TZ = 'UTC'; // Força UTC em todo o Node.js

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(cors()); 
app.use(express.json()); //é um middleware que analisa o corpo das requisições HTTP com o tipo de conteúdo application/json.
app.use(loginRouter);
app.use(booksRouter);
app.use(categoryRouter);
app.use(usersRouter);
app.use(express.urlencoded({ extended: true }));

// Serve arquivos estáticos da pasta uploads
app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')));

// Conexão com o MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("✅ Conectado ao MongoDB Atlas"))
.catch(err => console.error("❌ Erro na conexão:", err));
 
app.listen(3000, () => console.log("Servidor escutando na porta 3000..."));