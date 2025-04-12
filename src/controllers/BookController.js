import { validationResult } from "express-validator";


class BookController {

    //essa rota passa pelo midleware verifyJWT, 'next' significa q se der certo ele passa pra proxima fase
    async index(req, res) {

        //buscar no banco e retornar todos os livros cadastrados

        return res.json({message: "retornou todos os livros!"})
    }

    async store(req, res) {

        //fazer validação
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
              success: false,
              errors: errors.array().map(e => ({
                field: e.param,
                message: e.msg
              }))
            });
          }

        //registrar no banco
        
        
        //dar um retorno
        return res.json({message: 'Livro cadastrado com sucesso'});
    }

}

export default new BookController();