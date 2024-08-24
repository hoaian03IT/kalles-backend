const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderLineSchema = new Schema(
    {
        productId: { type: mongoose.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        order: { type: mongoose.Types.ObjectId, ref: "Order" },
        status: { type: String, default: "Pending", enums: ["Pending", "Shipping", "Delivered"] },
        is_paid: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("OrderLine", OrderLineSchema);
