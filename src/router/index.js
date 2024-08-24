const authRouter = require("./auth.router");
const categoryRouter = require("./category.router");
const productRouter = require("./product.router");
const reviewRouter = require("./review.router");
const whitelistRouter = require("./whitelist.router");
const orderRouter = require("./order.router");

function router(app) {
    app.use("/auth", authRouter);
    app.use("/category", categoryRouter);
    app.use("/product", productRouter);
    app.use("/review", reviewRouter);
    app.use("/whitelist", whitelistRouter);
    app.use("/order", orderRouter);
}

module.exports = router;
