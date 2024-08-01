const { reviewController } = require("../apps/controllers");
const { authenticate, checkAdminRole } = require("../apps/middlewares");
const router = require("express").Router();

router.post("/create", [authenticate, checkAdminRole], reviewController.createReview);
router.get("/total-rate/:productId", reviewController.fetchTotalRate);
router.get("/avg-rate/:productId", reviewController.calculateRateOfProduct);
router.get("/get-reviews", reviewController.fetchReviewsByProduct);
router.get("/init-rate-product", [authenticate, checkAdminRole], reviewController.initRateProduct);

module.exports = router;
