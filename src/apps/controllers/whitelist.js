const mongoose = require("mongoose");
const { WhitelistModel, ProductModel } = require("../models");

class Whitelist {
    async addNew(req, res) {
        try {
            const { _id: userId } = req.user;
            let { productId } = req.body;

            if (!productId) {
                return res.status(404).send({ message: "{productId} cannot be empty" });
            }

            let isExistedProduct = await ProductModel.exists(new mongoose.Types.ObjectId(productId));
            if (!isExistedProduct) {
                return res.status(404).send({ message: "productId is not valid" });
            }
            await WhitelistModel.findOneAndUpdate(
                { user_id: new mongoose.Types.ObjectId(userId) },
                { $addToSet: { product_ids: new mongoose.Types.ObjectId(productId) } }, // $addToSet ensures no duplicates >< $push can have duplicates
                { new: true, upsert: true }
            );
            res.status(200).json({ message: "Added to whitelist successfully" });
        } catch (error) {
            res.status(500).json({ message: "Internal server error." });
        }
    }

    async removeOne(req, res) {
        try {
            const { _id: userId } = req.user;
            const { productId } = req.params;

            if (!productId) {
                return res.status(404).send({ message: "{productId} cannot be empty" });
            }

            await WhitelistModel.findOneAndUpdate(
                { user_id: new mongoose.Types.ObjectId(userId) },
                { $pull: { product_ids: productId } },
                { new: true }
            );
            res.status(200).json({ message: "Removed from whitelist successfully" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getWhitelist(req, res) {
        try {
            const { _id: userId } = req.user;

            let recordset = await WhitelistModel.findOne({ user_id: new mongoose.Types.ObjectId(userId) }).populate(
                "product_ids",
                "name previewImages price discount sold stock"
            );
            res.status(200).json({ whitelist: recordset?.product_ids || [] });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new Whitelist();
