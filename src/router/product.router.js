const { productController } = require("../apps/controllers");
const router = require("express").Router();
const authenticate = require("../apps/middlewares/authenticate");
const { checkAdminRole } = require("../apps/middlewares/checkRole");

router.post("/create", authenticate, checkAdminRole, productController.createProduct);
router.get("/filter", productController.filterProduct);
router.get("/details/:idProduct", productController.getDetailsProduct);
router.get("/highest-price", productController.getProductHighestPrice);

module.exports = router;
