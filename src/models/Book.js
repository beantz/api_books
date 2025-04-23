
import mongoose from "mongoose";

const BooksSchema = new mongoose.Schema({
    titulo: {
        type: String
    },
    autor: {
        type: String
    },
    preco: {
        type: Number
    },
    estado: {
        type: String
    },
    descricao: {
        type: String
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    categoria_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    }],
    review: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
}, {
    timestamps: true 
})

export default mongoose.model('Book', BooksSchema);