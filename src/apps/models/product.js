const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema(
    {
        category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        stock: { type: Number, required: true },
        image: [{ type: String, required: true }],
        discount: { type: Number },
        sex: [{ type: String, required: true, enum: ["Men", "Women"] }],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Product", productSchema);
