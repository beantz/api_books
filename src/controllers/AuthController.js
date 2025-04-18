import jwt from 'jsonwebtoken';
import 'dotenv-safe/config.js';
import { body, validationResult } from 'express-validator';
import speakeasy from 'speakeasy';
import nodemailer from 'nodemailer';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

const saltRounds = 10; 

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
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array().map(e => ({
          field: e.param,
          msg: e.msg
        }))
      });
    }
    
    //verificar se email enviados existem no banco
    const { email, password } = req.body;

    const user = await User.findOne({email});
    
    if(!user) {
      return res.status(404).json({ message: 'E-mail não encontrado' });
    }

    // Verificar se a senha está correta
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Senha incorreta' });
    }
    
    try {
      const token = await jwt.sign({ id: user.id }, process.env.SECRET, {
      expiresIn: 300 // expires in 5min
      });

      return res.json({ auth: true, token, user });

    } catch (error) {

      return res.status(500).json({ message: 'Erro ao fazer login' });

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

    const { nome, email, senha, contato } = req.body;

    //verificar se ja não existe um usuario cadastrado no banco com o mesmo email
    try {

      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ 
            message: 'Já existe um usuário cadastrado com este email' 
        });
      } 

      const hashedPassword = await bcrypt.hash(senha, saltRounds);

      const newUser = await User.create({
        nome,
        email,
        senha: hashedPassword,
        contato
      });

      const userName = req.body.nome;

      const token = await jwt.sign({ userName }, process.env.SECRET, {
        expiresIn: 300 // expires in 5min
      });

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

    // gerar código secreto temporário (válido por 10 minutos)
    const secret = speakeasy.generateSecret({ length: 20 });
    const token = speakeasy.totp({
      secret: secret.base32,
      encoding: 'base32',
      step: 600 // 10 minutos
    });

    // //salvar no banco
    await User.updateOne({ email }, { 
      resetPasswordToken: secret.base32,
      resetPasswordExpires: new Date(Date.now() + 600000)
    });

    /* vai gerar uma secret, q vai ser algo aleatorio pra ser usado como base no token, 
    ai vai ser criado um token TOTP (senha temporaria) com base nessa secret e com tempo de duração vai ser retornado um codigo numerico,
     e em resetPasswordToken vai ser salvo a secret gerada para depois
    realizar a verificação com o codigo gerado */

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
    const { token, email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    // Verificação de expiração
    if (!user.resetPasswordExpires || user.resetPasswordExpires.getTime() < Date.now()) {
      return res.status(400).json({ 
        error: 'Código expirado',
        debug: {
          serverTime: new Date(),
          expiration: user.resetPasswordExpires
        }
      });
    }
  
    // Verificação com tolerância aumentada
    const isValid = speakeasy.totp.verify({
      secret: user.resetPasswordToken,
      encoding: 'base32',
      token: token,
      step: 600, // Adicione esta linha
      window: 1
    });

    if (!isValid) {
      return res.status(400).json({ 
          error: 'Código inválido',
          debug: {
              serverTime: new Date().toISOString(),
              //expectedToken: expectedToken,
              receivedToken: token
          }
      });
    }

    // Limpa o token após uso
    await User.updateOne({ email }, { 
        resetPasswordToken: null,
        resetPasswordExpires: null 
    });

    res.status(200).json({ success: true });
  }

  //altera a senha
  async verifyAndResetPassword(req, res) {
    const {token, novaSenha, email } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map(error => ({
          field: error.param,      // Indica qual campo falhou (ex: 'novaSenha')
          message: error.msg       // Mensagem de erro correspondente
        }))
      });
    }

    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

      const hashedPassword = await bcrypt.hash(novaSenha, saltRounds);

      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      await user.save();

      res.status(200).json({ success: true, message: 'Senha redefinida com sucesso!' });

    } catch {
  
      return res.status(500).json({
        success: false,
        error: 'Erro interno no servidor'
      });
    }
  }
}

export default new AuthController(); //retorna uma instancia da classe