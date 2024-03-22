const { rateProductController } = require("../apps/controllers");
const router = require("express").Router();

router.post("/create", rateProductController.createRate);

module.exports = router;
