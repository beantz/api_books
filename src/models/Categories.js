
import mongoose from "mongoose";

const CategoriesSchema = new mongoose.Schema({
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

export default mongoose.model('Category', CategoriesSchema);