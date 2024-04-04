const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderSchema = new Schema(
    {
        buyerId: { type: mongoose.Types.ObjectId, ref: "User" },
        paymentMethod: { type: String, required: true },
        address: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Order", OrderSchema);
