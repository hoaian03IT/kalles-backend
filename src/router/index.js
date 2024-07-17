const authRouter = require("./auth.router");
const categoryRouter = require("./category.router");
const productRouter = require("./product.router");
const reviewRouter = require("./review.router");

function router(app) {
    app.use("/auth", authRouter);
    app.use("/category", categoryRouter);
    app.use("/product", productRouter);
    app.use("/review", reviewRouter);
}

module.exports = router;
