const authRouter = require("./auth");
const categoryRouter = require("./category");

function router(app) {
    app.use("/auth", authRouter);
    app.use("/category", categoryRouter);
}

module.exports = router;
