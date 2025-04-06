import { validationResult } from "express-validator";


class livrosController {

    //essa rota passa pelo midleware verifyJWT, 'next' significa q se der certo ele passa pra proxima fase
    async index(req, res) {
        //buscar no banco

        return res.json({message: "retornou todos os livros!"})
    }

    async store(req, res) {

        //fazer validação
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({
                success: false,
                errors: errors.array().map(error => ({
                    field: error.param,
                    message: error.msg
                }))
            });
        }

        //mandar pro banco
        
        //dar um retorno
        return res.json({message: 'Livro cadastrado com sucesso'});
    }

}

export default new livrosController();