import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    productImage: {
        type: String,
        required: true,
    },
    stockQuantity: {
        type: Number,
        default: 0,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true });



export const Product = mongoose.model("Product", productSchema);