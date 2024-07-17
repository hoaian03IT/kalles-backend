const mongoose = require("mongoose");
const { Schema } = mongoose;

const ReviewSchema = new Schema(
    {
        product_id: { type: mongoose.Types.ObjectId, ref: "Product", required: true },
        title: { type: String, default: "" },
        rate: { type: Number, required: true },
        content: { type: String, default: "" },
        owner: { type: mongoose.Types.ObjectId, ref: "User", required: true },
        email: { type: String, required: true },
        photos: [{ type: String }],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Review", ReviewSchema);
