const mongoose = require("mongoose");
const { Schema } = mongoose;

const colorProductSchema = new Schema(
    {
        name: { type: String, required: true },
        hex: { type: String, required: true },
        sizes: [{ type: mongoose.Types.ObjectId, ref: "SizeProduct" }],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("ColorProduct", colorProductSchema);
