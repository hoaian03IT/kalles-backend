const mongoose = require("mongoose");
const { Schema } = mongoose;

const SizeProductSchema = new Schema(
    {
        product_id: { type: mongoose.Types.ObjectId, required: true, ref: "Product" },
        abbreviation: { type: String, required: true },
        name: { type: String, required: true },
        description: { type: String, required: true },
        is_active: { type: Boolean, required: true, default: true },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("SizeProduct", SizeProductSchema);
