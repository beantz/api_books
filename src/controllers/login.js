import jwt from 'jsonwebtoken';
import 'dotenv-safe/config.js';

// const app = express();
// app.use(express.json());

//AUTENTICAÇÃO
// app.post('/login', (req, res, next) => {
//   //esse teste abaixo deve ser feito no seu banco de dados
//   if(req.body.user === "luiz" && req.body.password === 123){
//     //auth ok
//     const id = 1; //esse id viria do banco de dados
//     const token =  jwt.sign({ id }, process.env.SECRET, {
//       expiresIn: 300 // expires in 5min
//     });
//     return res.json({ auth: true, token: token });
    
//   } else {
//     res.status(500).json({message: 'Login inválido!'});
//   }
// })

class loginController {

    async auth(req, res) {
        if(req.body.user === "luiz" && req.body.password === 123){
          
          const id = 1; //esse id viria do banco de dados
          try {
            const token = await jwt.sign({ id }, process.env.SECRET, {
            expiresIn: 300 // expires in 5min
            });

            return res.json({ auth: true, token: token });

          } catch (error) {

            console.error("Erro ao gerar token", error);
            return res.status(500).json({message: "Erro interno no servidor"});

          }
          
        } else {
            res.status(500).json({message: 'Login inválido!'});
        }
    }
}

export default new loginController();