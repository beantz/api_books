import 'dotenv-safe/config.js';
import express, { Router } from 'express';
import livrosRouter from './src/route/livros.js';
import loginRouter from './src/route/login.js';

const app = express();

app.use(express.json()); //é um middleware que analisa o corpo das requisições HTTP com o tipo de conteúdo application/json.
app.use(loginRouter);
app.use(livrosRouter);
 
app.listen(3000, () => console.log("Servidor escutando na porta 3000..."));

import db from './src/config/dbconfig.js';
