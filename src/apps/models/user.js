const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        avatar: { type: String, required: true },
        gender: {
            type: String,
            enum: { values: ["male", "female"], message: "{VALUE} is not supported" },
            required: true,
        },
        role: {
            type: String,
            default: "customer",
            enum: { values: ["customer", "admin"], message: "{VALUE} is not supported" },
        },
        phoneNumber: { type: String, default: "" },
        is_updated: { type: Boolean, required: true, default: false },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);
