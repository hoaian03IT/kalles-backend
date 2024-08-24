const mongoose = require("mongoose");
const { ReviewModel, OrderModel, ProductModel } = require("../models");

class Review {
    async createReview(req, res) {
        try {
            const { productId, title, content, rate, email, photos = [] } = req.body;
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
                        buyer_id: new mongoose.Types.ObjectId(_id),
                        "orderlines.productId": new mongoose.Types.ObjectId(productId),
                    },
                },
            ]);

            if (isBought.length === 0) {
                return res.status(403).json({ message: "You must buy the product before reviewing" });
            }

            const newReview = new ReviewModel({
                product_id: productId,
                title,
                rate,
                content,
                owner: "666ed327343e0874f2bd3a0d",
                email,
                photos,
            });
            await newReview.save();
            res.status(200).json({ message: "Your review was submitted" });
        } catch (error) {
            res.status(500).json({ message: "Internal server error." });
        }
    }

    async fetchReviewsByProduct(req, res) {
        try {
            const { "product-id": productId, nPage = 4, page = 1, rate = -1, skip = true, sort = "newest" } = req.query;
            const rateFilter = Number(rate) !== -1 ? { rate } : {};
            const orderCreatedAt = sort === "oldest" ? { updatedAt: 1 } : { updatedAt: -1 };
            const reviews = await ReviewModel.find({ product_id: productId, ...rateFilter })
                .select("product_id title rate content owner photos updatedAt")
                .populate({ path: "owner", select: "firstName lastName avatar" })
                .skip(skip ? (page - 1) * nPage : 0)
                .limit(nPage)
                .sort(orderCreatedAt);
            const countDocs = await ReviewModel.countDocuments({ product_id: productId, ...rateFilter });
            res.status(200).json({ reviews, pages: Math.ceil(countDocs / nPage), page: page });
        } catch (error) {
            res.status(500).json({ message: "Internal server error." });
        }
    }

    async fetchTotalRate(req, res) {
        try {
            const { productId } = req.params;
            const totalRate = await ReviewModel.find({ product_id: productId }).select("rate");
            res.status(200).json({ totalRate });
        } catch (error) {
            res.status(500).json({ message: "Internal server error." });
        }
    }

    async calculateRateOfProduct(req, res) {
        const { productId } = req.params;
        try {
            const rate = await ReviewModel.aggregate([
                {
                    $match: {
                        product_id: new mongoose.Types.ObjectId(productId),
                    },
                },
                {
                    $group: {
                        _id: "$product_id",
                        averageRate: { $avg: "$rate" },
                    },
                },
                {
                    $project: {
                        averageRate: {
                            $round: ["$averageRate", 1],
                        },
                    },
                },
            ]);
            res.status(200).json({ rate: rate[0]?.averageRate || 0 });
        } catch (error) {
            res.status(500).json({ message: "Internal server error." });
        }
    }

    async initRateProduct(req, res) {
        try {
            let products = await ProductModel.find({});
            for (let product of products) {
                let review = await ReviewModel.aggregate([
                    {
                        $match: {
                            product_id: product._id,
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            rate: { $avg: "$rate" },
                        },
                    },
                ]);
                await ProductModel.findByIdAndUpdate(product._id, { rate: review[0].rate || 0 });
            }
            res.status(200).send("success");
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
}

module.exports = new Review();
