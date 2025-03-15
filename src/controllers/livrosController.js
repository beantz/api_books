

class livrosController {

    //essa rota passa pelo midleware verifyJWT, 'next' significa q se der certo ele passa pra proxima fase
    async index(req, res) {
        return res.json({message: "retornou todos os livros!"})
    }

}

export default new livrosController();