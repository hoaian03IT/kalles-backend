const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema(
    {
        category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        previewImages: [{ type: String, required: true }],
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        discount: { type: Number, default: 0 },
        colors: [{ type: mongoose.Types.ObjectId, ref: "ColorProduct" }],
        sex: { type: String, required: true, enum: ["men", "women", "unisex"] },
        stock: { type: Number, required: true },
        sold: { type: Number, default: 0 },
        feedbacks: [{ type: mongoose.Types.ObjectId, ref: "RateProduct" }],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Product", productSchema);
