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
        methods: {
            quantityProducts() {
                return mongoose.model("Product").countDocuments({ _id: this._id });
            },
        },
        timestamps: true,
    }
);

module.exports = mongoose.model("Category", categorySchema);
