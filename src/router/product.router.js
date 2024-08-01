const { productController } = require("../apps/controllers");
const { authenticate } = require("../apps/middlewares");
const checkAdminRole = require("../apps/middlewares/checkRole");
const router = require("express").Router();

router.post("/create", /*authenticate, checkAdminRole,*/ productController.createProduct);
router.get("/filter", productController.filterProduct);
router.get("/details/:productId", productController.getDetailsProduct);
router.get("/highest-price", productController.getProductHighestPrice);
router.get("/suggest/:categoryId", productController.getSuggestedProduct);
router.get("/quantity-sold", productController.getQuantityAdnSoldProduct);
router.get("/init-stock-product", productController.initStockOfProduct);

module.exports = router;
