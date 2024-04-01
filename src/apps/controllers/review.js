const mongoose = require("mongoose");
const { ReviewModel } = require("../models");

class Review {
    async createReview(req, res) {}
    async fetchReviewsByProduct(req, res) {
        try {
            const { product, nReview = 4, page = 1, rate = -1 } = req.query;
            const rateFilter = rate !== -1 ? { rate } : {};
            const reviews = await ReviewModel.find({ product, ...rateFilter })
                .select("product title rate content owner")
                .populate({ path: "owner", select: "firstName lastName avatar" })
                .skip((page - 1) * nReview)
                .limit(nReview);
            const countDocs = await ReviewModel.countDocuments({ product, ...rateFilter });
            res.status(200).json({ reviews, pages: Math.ceil(countDocs / nReview), page: page });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = new Review();
