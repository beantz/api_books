import 'dotenv-safe/config.js';
import express, { Router } from 'express';
import livrosRouter from './src/route/books.js';
import loginRouter from './src/route/login.js';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
app.use(cors()); 
app.use(express.json()); //é um middleware que analisa o corpo das requisições HTTP com o tipo de conteúdo application/json.
app.use(loginRouter);
app.use(livrosRouter);

// Conexão com o MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("✅ Conectado ao MongoDB Atlas"))
.catch(err => console.error("❌ Erro na conexão:", err));

// Rota de teste
app.get("/", (req, res) => {
res.send("API Node.js + MongoDB Atlas funcionando!");
});
 
app.listen(3000, () => console.log("Servidor escutando na porta 3000..."));
