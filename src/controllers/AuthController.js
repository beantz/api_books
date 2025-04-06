import jwt from 'jsonwebtoken';
import 'dotenv-safe/config.js';
import { body, validationResult } from 'express-validator';
import speakeasy from 'speakeasy';
import nodemailer from 'nodemailer';
import User from '../models/User.js';

// Configuração do transporter de e-mail (usando Gmail como exemplo)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS 
  }
});

class AuthController {

  async auth(req, res) {

    // Verifica os erros de validação
    const errors = validationResult(req);

    //Se houver erros, retorna uma resposta com os erros
    if(!errors.isEmpty()) {
      return res.status(400).json({ 
        errors: errors.array().map(error => ({
          path: error.param,
          msg: error.msg
        }))
      });
    }
    
    //verificar se email enviados existem no banco
    //iMPLEMENTAR LOGICA
    
    const id = 1; //esse id viria do banco de dados
    try {
      const token = await jwt.sign({ id }, process.env.SECRET, {
      expiresIn: 300 // expires in 5min
      });

      // Adicionar token aos headers da resposta
      // res.setHeader('Authorization', `Bearer ${token}`);

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

    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        errors: errors.array().map(error => ({
          path: error.param,
          msg: error.msg
        }))
      });
    }

    const { name, email, senha, contato } = req.body;

    //verificar se ja não existe um usuario cadastrado no banco com o mesmo email
    try {

      const userExists = await User.findOne({ email });
      if (userExists) {
          return res.status(400).json({ 
              message: 'Já existe um usuário cadastrado com este email' 
          });
      } 

      const newUser = await User.create({
        name,
        email,
        senha, // Nota: Você deve hashear a senha antes de salvar!
        contato
      });

      const userName = req.body.name;

      const token = await jwt.sign({ userName }, process.env.SECRET, {
        expiresIn: 300 // expires in 5min
      });

      // Adicionar token aos headers da resposta
      //res.setHeader('Authorization', `Bearer ${token}`);

      return res.json({ message: 'Usuário cadastrado com sucesso!', auth: true, token: token });

    } catch(error) {

      return res.status(401).json({ message: 'Erro ao tentar cadastrar usuario!' });

    }
  }

  //envia codigo no email
  async requestPasswordReset(req, res) {
    const { email } = req.body;

    // Verifica os erros de validação
    const errors = validationResult(req);

    // Se houver erros, retorna uma resposta com os erros
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // 1. Gerar código secreto temporário (válido por 10 minutos)
    const secret = speakeasy.generateSecret({ length: 20 });
    const token = speakeasy.totp({
      secret: secret.base32,
      encoding: 'base32',
      step: 600 // 10 minutos
    });

    //2. Salvar no banco (exemplo simplificado)
    await User.updateOne({ email }, { 
      resetPasswordToken: secret.base32,
      resetPasswordExpires: Date.now() + 600000 // 10 minutos
    });

    // 3. Enviar e-mail com o código
    const mailOptions = {
      from: 'trizmours2002@gmail.com',
      to: email,
      subject: 'Código de verificação (2FA)',
      html: `
        <p>Seu código para redefinição de senha é: <strong>${token}</strong></p>
        <p>Valido por 10 minutos.</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ 
      message: 'Código de verificação enviado!',
      tempToken: secret.base32 
    });
  }

  //verifica codigo
  async verifyCode(req, res) {
    const { token } = req.body;

    //PAREI AQUI
    // 2. Verificar o código (simulação)
    const isValid = speakeasy.totp.verify({
      secret: User.resetPasswordToken, // secret.base32 salvo anteriormente
      encoding: 'base32',
      token: token,
      window: 1 // Permite 1 passo (10 minutos) de tolerância
    });

    if (!isValid) {
      return res.status(400).json({ error: 'Código inválido ou expirado' });
    }

    res.status(200).json({ success: true, token: token});
  }

  //altera a senha
  async verifyAndResetPassword(req, res) {
    const {token, novaSenha, email } = req.body;

    // 1. Buscar usuário no banco
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    // 3. Atualizar senha (use bcrypt na prática!)
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Senha redefinida com sucesso!' });
  }

}

export default new AuthController(); //retorna uma instancia da classe