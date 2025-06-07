import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },

    stockQuantity: {
        type: Number,
        required: true,
        min: 0,
    }
}, {timestamps: true});



export const Product = mongoose.model("Product", productSchema);