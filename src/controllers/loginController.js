import jwt from 'jsonwebtoken';
import 'dotenv-safe/config.js';

class loginController {

  async auth(req, res) {
      //verificar se dados enviados existem no banco
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

  logout(req, res) {

    return res.json({auth: false, token: null, message: "Logout feito com sucesso!"});

  }

  async register(req,res) {

    if (!req.body.name || !req.body.email) {
      return res.status(401).json({ message: 'Nome e e-mail precisam ser fornecidos!' });
    }

    try {

      const userName = req.body.name; // Extrai o nome do usuário

      const token = await jwt.sign({ userName }, process.env.SECRET, {
        expiresIn: 300 // expires in 5min
      });

      return res.json({ message: 'Usuário cadastrado com sucesso!', auth: true, token: token });

    } catch(error) {

      return res.status(401).json({ message: 'Token inválido!' });

    }
  }
}

export default new loginController(); //retorna uma instancia da classe