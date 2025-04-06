
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    nome: {
        type: String
        
    },
    email: {
        type: String,
        unique: true
    },
    senha: {
        type: String
    },
    contato: {
        type: Number
    },
    resetPasswordToken: {
        type: String,
        default: null
      },
    resetPasswordExpires: {
    type: Date,
    default: null
    },
    livros: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    }],
    review: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
}, {
    timestamps: true 
})

export default mongoose.model('User', UserSchema);