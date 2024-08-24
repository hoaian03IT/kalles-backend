const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderSchema = new Schema(
    {
        buyer_id: { type: mongoose.Types.ObjectId, ref: "User" },
        paymentMethod: { type: String, required: true, enums: ["Cash", "Banking"] },
        address: {
            street: { type: String, required: true, trim: true },
            city: { type: String, required: true, trim: true },
            state: { type: String, required: true, trim: true },
            postalCode: { type: String, required: true, trim: true },
            country: { type: String, required: true, trim: true },
        },
        product_id: { type: mongoose.Types.ObjectId, ref: "Product", required: true },
        size_id: { type: mongoose.Types.ObjectId, ref: "SizeProduct", required: true },
        color_id: { type: mongoose.Types.ObjectId, ref: "ColorProduct", required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        status: { type: String, default: "Pending", enums: ["Pending", "Shipping", "Delivered"] },
        is_paid: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Order", OrderSchema);
