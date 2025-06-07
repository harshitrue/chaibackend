import mngoose from 'mongoose';

const orderItemSchema = new mngoose.Schema({
    productId: {
        type: mngoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    }
});

const orderSchema = new mngoose.Schema({
    orderPrice: {
        type: Number,
        required: true,
    },
    customer: {
        type: mngoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    orderItems: {
        type: [orderItemSchema],
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
        default: "Pending",
    },
}, { timestamps: true });
export const Order = mngoose.model("Order", orderSchema);