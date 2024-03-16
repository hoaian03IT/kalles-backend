const mongoose = require("mongoose");
const { Schema } = mongoose;

const categorySchema = new Schema(
    {
        name: { type: String, required: true },
        key: { type: String, required: true },
        description: { type: String },
        img: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Category", categorySchema);
