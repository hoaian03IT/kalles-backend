const { whitelistController } = require("../apps/controllers");
const { authenticate } = require("../apps/middlewares");
const router = require("express").Router();

router.get("/", [authenticate], whitelistController.getWhitelist);
router.post("/add", [authenticate], whitelistController.addNew);
router.delete("/remove/:productId", [authenticate], whitelistController.removeOne);

module.exports = router;
