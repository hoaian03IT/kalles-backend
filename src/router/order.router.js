const { orderController } = require("../apps/controllers");
const { authenticate } = require("../apps/middlewares");
const router = require("express").Router();

router.post("/create", authenticate, orderController.createOrder);
router.get("/all", authenticate, orderController.getOrders);

module.exports = router;
