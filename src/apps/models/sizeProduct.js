const mongoose = require("mongoose");
const { Schema } = mongoose;

const SizeProductSchema = new Schema(
    {
        image: { type: String, required: true },
        name: { type: String, required: true },
        description: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("SizeProduct", SizeProductSchema);
