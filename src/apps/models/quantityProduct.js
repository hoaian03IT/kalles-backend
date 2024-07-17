const mongoose = require("mongoose");
const { Schema } = mongoose;

const quantityProduct = new Schema(
    {
        product_id: { type: mongoose.Types.ObjectId, required: true, ref: "Product" },
        color_id: { type: mongoose.Types.ObjectId, required: true, ref: "ColorProduct" },
        size_id: { type: mongoose.Types.ObjectId, required: true, ref: "SizeProduct" },
        quantity: { type: Number, required: true, default: 0 },
        sold: { type: Number, required: true, default: 0 },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("QuantityProduct", quantityProduct);
