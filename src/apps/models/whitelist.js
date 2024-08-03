const mongoose = require("mongoose");
const { Schema } = mongoose;

const whitelistSchema = new Schema(
    {
        user_id: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
        product_ids: [{ type: mongoose.Types.ObjectId, ref: "Product" }],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Whitelist", whitelistSchema);
