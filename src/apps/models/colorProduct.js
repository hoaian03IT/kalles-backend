const mongoose = require("mongoose");
const { Schema } = mongoose;

const colorProductSchema = new Schema(
    {
        product_id: { type: mongoose.Types.ObjectId, required: true, ref: "Product" },
        name: { type: String, required: true },
        hex: { type: String, required: true },
        images: [{ type: String, required: true }],
        is_active: { type: Boolean, required: true, default: true },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("ColorProduct", colorProductSchema);
