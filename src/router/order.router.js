const { orderController } = require("../apps/controllers");
const { authenticate } = require("../apps/middlewares");
const router = require("express").Router();

router.get("/detail/:id", authenticate, orderController.getDetailedOrder);
router.post("/create", authenticate, orderController.createOrder);
router.get("/all", authenticate, orderController.getOrders);

module.exports = router;
