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

dotenv.config();

const app = express();
app.use(cors()); 
app.use(express.json()); //é um middleware que analisa o corpo das requisições HTTP com o tipo de conteúdo application/json.
app.use(loginRouter);
app.use(booksRouter);
app.use(categoryRouter);
app.use(usersRouter);

// Conexão com o MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("✅ Conectado ao MongoDB Atlas"))
.catch(err => console.error("❌ Erro na conexão:", err));
 
app.listen(3000, () => console.log("Servidor escutando na porta 3000..."));
