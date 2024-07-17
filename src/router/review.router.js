const { reviewController } = require("../apps/controllers");
const { authenticate } = require("../apps/middlewares");
const router = require("express").Router();

router.post("/create", authenticate, reviewController.createReview);
router.get("/total-rate/:productId", reviewController.fetchTotalRate);
router.get("/avg-rate/:productId", reviewController.calculateRateOfProduct);
router.get("/get-reviews", reviewController.fetchReviewsByProduct);

module.exports = router;
