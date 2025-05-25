import { validationResult } from "express-validator";
import User from '../models/User.js';

class UserController {
    async allUsers(req, res) {
        try {
            const users = await User.find()
                .select('-senha -resetPasswordToken -resetPasswordExpires -__v')
                .lean();

            return res.json({
                success: true,
                count: users.length,
                data: users
            });

        } catch (error) {
            console.error("Erro ao buscar todos os usuários:", error);
            return res.status(500).json({ 
                success: false,
                message: "Erro interno no servidor ao listar usuários" 
            });
        }
    }

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

            const userExists = await User.findById(userId);
            if (!userExists) {
                return res.status(404).json({ message: "Usuário não encontrado" });
            }

            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { nome, email, contato },
                { 
                    new: true,          
                    runValidators: true
                }
            ).select('-senha -resetPasswordToken -resetPasswordExpires -__v');

            return res.json({
                success: true,
                message: "Dados do usuário atualizados com sucesso",
                user: updatedUser
            });

        } catch (error) {
            console.error("Erro ao atualizar usuário:", error);
            
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