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
            // validate: {
            //     validator: function (value) {
            //         return value === "male" || value === "female";
            //     },
            // },
            enum: { values: ["male", "female"], message: "{VALUE} is not supported" },
            required: true,
        },
        phoneNumber: { type: String, default: "" },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);
