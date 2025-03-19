import jwt from 'jsonwebtoken';
import 'dotenv-safe/config.js';
import { body, validationResult } from 'express-validator';
import express from 'express';

class loginController {

  async auth(req, res) {

    // Verifica os erros de validação
    const errors = validationResult(req);

    // Se houver erros, retorna uma resposta com os erros
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //verificar se dados enviados existem no banco
    //iMPLEMENTAR LOGICA
    
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
        
  }

  logout(req, res) {

    return res.json({auth: false, token: null, message: "Logout feito com sucesso!"});

  }

  async register(req,res) {

    // Verifica os erros de validação
    const errors = validationResult(req);

    // Se houver erros, retorna uma resposta com os erros
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //verificar se ja não existe um usuario cadastrado no banco com o mesmo email
    //IMPLEMENTAR LOGICA

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