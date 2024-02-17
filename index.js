const connectDB = require("./src/db");
require("morgan")("dev");
require("dotenv").config();
const router = require("./src/router");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");

const app = express();
const port = 4000;

// connect to database
connectDB();

app.use(bodyParser.urlencoded({ extended: true, limit: 1024 }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({ credentials: true, methods: "*", origin: "http://localhost:3000" }));

// config route
router(app);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
