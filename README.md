# 📚 Labersaler API

  é uma API para compartilhamento de livros, permitindo que usuários cadastrem-se, publiquem livros para venda ou doação, e avaliem obras. A API inclui autenticação segura e sistema de recuperação de senha via e-mail.

## 🌟 Funcionalidades Principais

### Autenticação de Usuários

  - Cadastro com e-mail e senha
  - Login com JWT
  - Recuperação de senha via código temporário

### Gestão de Livros

  - Publicação de livros para venda/doação
  - Busca e filtragem de livros
  - Sistema de avaliações e comentários

### Segurança

  - Validação de dados em todas as rotas
  - Middleware de autenticação JWT
  - Criptografia de senhas

## 📁 Estrutura de Pastas

```
├── .expo
├── node_modules
└── src
    ├── config
    │   └── dbconfig.js
    ├── controllers
    │   ├── authController.js
    │   └── livrosController.js
    ├── email
    │   └── enviarEmail.js
    ├── middleware
    │   └── authJwt.js
    ├── models
    │   ├── Book.js
    │   ├── Category.js
    │   ├── Review.js
    │   └── User.js
    ├── request
    │   ├── validateEmail.js
    │   ├── validateUserRegister.js
    │   ├── validationBooks.js
    │   └── validationLogin.js
    └── route
        ├── books.js
        └── login.js
```

### Pré-requisitos
- Node.js (v18+)
<!-- - MongoDB Atlas ou local -->
- NPM/Yarn
- Postman (para testar as rotas)

### Instalação
```bash
git clone https://github.com/beantz/api_books.git
cd api_books
npm install
npm start