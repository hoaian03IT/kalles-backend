const mongoose = require("mongoose");

async function connectDB() {
    try {
        mongoose.connect("mongodb://127.0.0.1:27017/kalles");
        console.log("====>> Database connected");
    } catch (error) {
        console.log(`====>> Connect database failed [error: ${error.message}]`);
    }
}

module.exports = connectDB;
