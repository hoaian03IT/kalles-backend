const { productController } = require("../apps/controllers");
const { authenticate } = require("../apps/middlewares");
const checkAdminRole = require("../apps/middlewares/checkRole");
const router = require("express").Router();

router.post("/create", authenticate, checkAdminRole, productController.createProduct);
router.get("/filter", productController.filterProduct);
router.get("/details/:idProduct", productController.getDetailsProduct);
router.get("/highest-price", productController.getProductHighestPrice);

module.exports = router;
