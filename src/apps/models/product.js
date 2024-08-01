const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema(
    {
        category_id: {
            type: mongoose.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        previewImages: [{ type: String, required: true }],
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        discount: { type: Number, default: 0 },
        sex: { type: String, required: true, enum: ["men", "women", "unisex"] },
        stock: { type: Number, required: true, default: 0 },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Product", productSchema);
