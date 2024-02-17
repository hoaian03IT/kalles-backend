const mongoose = require("mongoose");
const { Schema } = mongoose;

const refreshTokenSchema = new Schema(
    {
        token: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("RefreshToken", refreshTokenSchema);
