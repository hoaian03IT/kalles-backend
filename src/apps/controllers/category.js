const { CategoryModel } = require("../models");

class Category {
    async getAll(req, res) {
        try {
            const categories = await CategoryModel.find({}).select(["name", "description", "_id", "img"]);
            res.status(200).json({ categories: categories });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async createOne(req, res) {
        try {
            const { name, description, img, key } = req.body;
            const hasExist = await CategoryModel.exists({ key });
            if (hasExist) {
                return res.status(400).json({ message: "Category already exists" });
            }
            const newCategory = await CategoryModel.create({ name, description, img, key });
            res.status(200).json({ category: newCategory });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = new Category();
