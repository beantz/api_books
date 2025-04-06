
import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
    nome: {
        type: String
    },
    livros_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
    }],
}, {
    timestamps: true 
})

export default mongoose.model('Category', CategorySchema);