const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderLineSchema = new Schema(
    {
        productId: { type: mongoose.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        order: { type: mongoose.Types.ObjectId, ref: "Order" },
        deliveryStatus: { type: Boolean, required: true, default: false },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("OrderLine", OrderLineSchema);
