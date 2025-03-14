import 'dotenv-safe/config.js';
import express from 'express';
import { verifyJWT } from './src/middleware/authJwt.js';

//SUBIR PRO GIT 

const app = express();
const loginRoutes = express.Router();

app.use(express.json());
app.use(loginRoutes);

// app.get('/', (req, res, next) => {
//     res.json({message: "Tudo ok por aqui!"});
// })
 
// //essa rota passa pelo midleware verifyJWT, 'next' significa q se der certo ele passa pra proxima fase
// app.get('/livros', verifyJWT, (req, res, next) => {
//     console.log("Retornou todos os livros!");
//     res.json([{id:1,nome:'luiz'}]);
// }) 

// app.post('/logout', function(req, res) {
//     res.json({auth: false, token: null});
// })
 
app.listen(3000, () => console.log("Servidor escutando na porta 3000..."));
