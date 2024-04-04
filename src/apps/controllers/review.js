const mongoose = require("mongoose");
const { ReviewModel, OrderModel } = require("../models");

class Review {
    async createReview(req, res) {
        try {
            const { productId, title, content, rate, email, photos } = req.body;
            const { _id } = req.user;

            const hasReviewed = await ReviewModel.exists({ product: productId, owner: _id });
            if (hasReviewed) {
                return res.status(403).json({ message: "You have reviewed this product before" });
            }

            const isBought = await OrderModel.aggregate([
                {
                    $lookup: {
                        from: "orderlines",
                        localField: "_id",
                        foreignField: "order",
                        as: "orderlines",
                    },
                },
                {
                    $match: {
                        buyerId: new mongoose.Types.ObjectId(_id),
                        "orderlines.productId": new mongoose.Types.ObjectId(productId),
                    },
                },
            ]);

            if (isBought.length === 0) {
                return res.status(403).json({ message: "You must buy the product before reviewing" });
            }

            const newReview = new ReviewModel({
                product: productId,
                title,
                rate,
                content,
                owner: _id,
                email,
                photos,
            });
            await newReview.save();
            res.status(200).json({ message: "Your review was submitted" });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async fetchReviewsByProduct(req, res) {
        try {
            const { product, nPage = 4, page = 1, rate = -1, skip = true, sort = "newest" } = req.query;
            const rateFilter = Number(rate) !== -1 ? { rate } : {};
            const orderCreatedAt = sort === "oldest" ? { updatedAt: 1 } : { updatedAt: -1 };
            const reviews = await ReviewModel.find({ product, ...rateFilter })
                .select("product title rate content owner photos")
                .populate({ path: "owner", select: "firstName lastName avatar" })
                .skip(skip ? (page - 1) * nPage : 0)
                .limit(nPage)
                .sort(orderCreatedAt);
            const countDocs = await ReviewModel.countDocuments({ product, ...rateFilter });
            res.status(200).json({ reviews, pages: Math.ceil(countDocs / nPage), page: page });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async fetchTotalRate(req, res) {
        try {
            const { product } = req.params;
            const totalRate = await ReviewModel.find({ product: product }).select("rate");
            res.status(200).json({ totalRate });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = new Review();
