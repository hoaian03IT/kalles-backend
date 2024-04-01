const { reviewController } = require("../apps/controllers");
const router = require("express").Router();

router.post("/create", reviewController.createReview);
router.get("/get-reviews", reviewController.fetchReviewsByProduct);

module.exports = router;
