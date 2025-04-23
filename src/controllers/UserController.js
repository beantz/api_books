import { validationResult } from "express-validator";
import User from '../models/User.js';

class UserController {
    async getUserById(req, res) {
        try {
            const user = await User.findById(req.params.userId)
                .select('-senha -resetPasswordToken -resetPasswordExpires -__v'); //remove campos sensíveis

            if (!user) {
                return res.status(404).json({ message: "Usuário não encontrado" });
            }

            return res.json(user);

        } catch (error) {
            console.error("Erro ao buscar usuário:", error);
            return res.status(500).json({ message: "Erro no servidor" });
        }
    }

    async updateUser(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { userId } = req.params;
            const { nome, email, contato } = req.body;

            // Verifica se o usuário existe
            const userExists = await User.findById(userId);
            if (!userExists) {
                return res.status(404).json({ message: "Usuário não encontrado" });
            }

            // Atualiza apenas os campos permitidos
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { nome, email, contato },
                { 
                    new: true,          // Retorna o documento atualizado
                    runValidators: true // Executa as validações do schema
                }
            ).select('-senha -resetPasswordToken -resetPasswordExpires -__v');

            return res.json({
                success: true,
                message: "Dados do usuário atualizados com sucesso",
                user: updatedUser
            });

        } catch (error) {
            console.error("Erro ao atualizar usuário:", error);
            
            // Tratamento especial para erro de email único
            if (error.code === 11000 && error.keyPattern.email) {
                return res.status(400).json({ 
                    success: false,
                    message: "Este email já está em uso por outro usuário" 
                });
            }

            return res.status(500).json({ 
                success: false,
                message: "Erro interno no servidor" 
            });
        }
    }
}

export default new UserController();