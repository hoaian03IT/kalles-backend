const mongoose = require("mongoose");
const { Schema } = mongoose;

const RateProductSchema = new Schema(
    {
        rate: { type: Number, required: true },
        feedback: { type: String, required: true },
        owner: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("RateProduct", RateProductSchema);
