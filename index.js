const connectDB = require("./src/db");
require("morgan")("dev");
require("dotenv").config();
const router = require("./src/router");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");

const express = require("express");

const app = express();
const port = process.env.POST || 4000;

// connect to database
connectDB();

app.use(bodyParser.urlencoded({ extended: true, limit: "20mb" }));
app.use(bodyParser.json({ limit: "20mb" }));
app.use(cookieParser());
const corsOptions = {
    credentials: true,
    origin: "*",
    methods: ["GET", "PUT", "POST", "DELETE"],
    allowedHeaders: "Content-Type,Authorization",
    optionsSuccessStatus: 200,
    preflightContinue: false,
};
app.use(cors(corsOptions));

// static files
app.use("/static", express.static("public"));

// config route
router(app);

morgan(":method :url :status :res[content-length] - :response-time ms");

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
