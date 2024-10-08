const { orderController } = require("../apps/controllers");
const { authenticate } = require("../apps/middlewares");
const router = require("express").Router();

router.get("/detail/:id", authenticate, orderController.getDetailedOrder);
router.post("/create", authenticate, orderController.createOrder);
router.get("/all", authenticate, orderController.getOrders);
router.get("/shipping-cost", orderController.getShipCost);
router.post("/create-payment", orderController.createPayment);

module.exports = router;
