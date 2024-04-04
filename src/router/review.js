const { reviewController } = require("../apps/controllers");
const { authenticate } = require("../apps/middlewares");
const router = require("express").Router();

router.post("/create", authenticate, reviewController.createReview);
router.get("/total-rate/:product", reviewController.fetchTotalRate);
router.get("/get-reviews", reviewController.fetchReviewsByProduct);

module.exports = router;
