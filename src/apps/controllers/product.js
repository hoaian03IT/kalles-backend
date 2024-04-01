const { model } = require("mongoose");
const { ReviewModel, SizeProductModel, ColorProductModel, ProductModel } = require("../models");

async function insertColors(colorsRaw) {
    let colorIds = [];
    for (const colorRaw of colorsRaw) {
        try {
            const { name, hex, sizes } = colorRaw;

            // Insert sizes and get their ids
            const insertedSizes = await SizeProductModel.insertMany(sizes, { rawResult: true }); // Assuming SizeModel is the correct name
            const sizeIds = Object.values(insertedSizes.insertedIds);

            // Create and save color document with size IDs
            const color = new ColorProductModel({ name, hex, sizes: sizeIds });
            await color.save();

            colorIds.push(color._id);
        } catch (error) {
            console.error("Error inserting color:", error);
        }
    }

    return colorIds;
}

class Product {
    async createProduct(req, res) {
        try {
            const {
                categoryId,
                name,
                description,
                price,
                discount,
                stock,
                sex = [],
                colors: colorsRaw = [],
                previewImages = [],
            } = req.body;

            let colors = await insertColors(colorsRaw);

            const newProduct = ProductModel({
                category: categoryId,
                previewImages,
                name,
                description,
                price,
                discount,
                colors,
                sex,
                stock,
            });
            newProduct.save();
            res.status(200).json({ product: newProduct });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async filterProduct(req, res) {
        try {
            const { category, order, query, sex, price, pageSize = 8, page = 1, stock } = req.query;
            const categoryFilter = category && category !== "all" ? { category } : {};
            const sortOrder =
                order === "asc"
                    ? { name: 1 }
                    : order === "desc"
                    ? { name: -1 }
                    : order === "lowest"
                    ? { price: 1 }
                    : order === "highest"
                    ? { price: -1 }
                    : order === "newest"
                    ? { createdAt: 1 }
                    : order === "sales"
                    ? { discount: -1 }
                    : order === "featured"
                    ? { sold: -1 }
                    : { _id: 1 };

            // nếu sex là men thì vừa có sản phẩm cho men và unisex, tương ứng với women
            // nếu sex là unisex thì chi có sản phẩm cho unisex
            const sexFilter =
                sex === "unisex"
                    ? { sex }
                    : sex === "men" || sex === "women"
                    ? { $or: [{ sex }, { sex: "unisex" }] }
                    : sex === "all"
                    ? {}
                    : { sex };
            const stockFilter =
                stock === "in-stock" ? { stock: { $gt: 0 } } : stock === "out-stock" ? { stock: 0 } : {};
            const priceFilter =
                price && price !== "all"
                    ? {
                          price: {
                              $gte: Number(price.split("-")[0]), // greatest
                              $lte: Number(price.split("-")[1]) || -1, // least
                          },
                      }
                    : {};

            const queryFilter = query
                ? {
                      name: {
                          $regex: query,
                          $options: "i",
                      },
                  }
                : {};
            console.log({
                ...categoryFilter,
                ...sexFilter,
                ...priceFilter,
                ...queryFilter,
                ...sortOrder,
            });
            const products = await ProductModel.find({
                ...categoryFilter,
                ...sexFilter,
                ...priceFilter,
                ...queryFilter,
                ...stockFilter,
            })
                .select("name previewImages price discount sold")
                .skip(pageSize * (page - 1))
                .limit(pageSize)
                .sort({ ...sortOrder });

            const countDocs = await ProductModel.countDocuments({
                ...categoryFilter,
                ...sexFilter,
                ...priceFilter,
                ...queryFilter,
                ...stockFilter,
            });
            res.status(200).json({ products: products, page: page, pages: Math.ceil(countDocs / pageSize) });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async getDetailsProduct(req, res) {
        try {
            const { idProduct } = req.params;
            const product = await ProductModel.findById(idProduct)
                .select("category previewImages name description price discount colors sex stock sold")
                .populate({ path: "category", select: "name key" })
                .populate({
                    path: "colors",
                    select: "name hex sizes",
                    populate: { path: "sizes", select: "image name description" },
                });

            const totalRates = await ReviewModel.find({ product: idProduct }).select("rate");
            const sumRate = totalRates.reduce((acc, curr) => acc + curr.rate, 0);

            res.status(200).json({
                product: {
                    ...product._doc,
                    rate: totalRates.length > 0 ? Math.fround(sumRate / totalRates.length).toFixed(1) : 0,
                },
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getProductHighestPrice(req, res) {
        try {
            const highestPriceProduct = await ProductModel.find({}).sort({ price: -1 }).limit(1);
            res.status(200).json({ price: highestPriceProduct[0].price });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = new Product();
