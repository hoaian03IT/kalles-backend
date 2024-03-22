const authRouter = require("./auth.router");
const categoryRouter = require("./category.router");
const productRouter = require("./product.router");
const rateProductRouter = require("./rateProduct.router");

function router(app) {
    app.use("/auth", authRouter);
    app.use("/category", categoryRouter);
    app.use("/product", productRouter);
    app.use("/rate", rateProductRouter);
}

module.exports = router;
