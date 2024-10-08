const mongoose = require("mongoose");
const { ReviewModel, SizeProductModel, ColorProductModel, ProductModel, QuantityProductModel } = require("../models");
const { validateNullOrUndefined } = require("../../utils/index");

async function insertColors(colorsRaw, productId) {
    const colorIds = [];
    for (const colorRaw of colorsRaw) {
        try {
            const { name, hex, images } = colorRaw;
            // Insert color
            const newColor = await ColorProductModel.create({
                product_id: new mongoose.Types.ObjectId(productId),
                name,
                hex,
                images: Array.isArray(images) ? images : [],
            });
            colorIds.push(newColor._id);
        } catch (error) {
            console.error("Error inserting colors:", error);
        }
    }
    return colorIds;
}

async function insertSizes(sizesRaw, productId) {
    const sizeIds = [];
    for (const sizeRaw of sizesRaw) {
        try {
            const { abbreviation, name, description } = sizeRaw;
            // Insert size
            const newSize = await SizeProductModel.create({
                product_id: new mongoose.Types.ObjectId(productId),
                abbreviation,
                name,
                description,
            });
            sizeIds.push(newSize._id);
        } catch (error) {
            console.error("Error inserting sizes:", error);
        }
    }
    return sizeIds;
}

async function initQuantities(sizeIds, colorIds, productId) {
    try {
        for (let sizeId of sizeIds) {
            for (let colorId of colorIds) {
                await QuantityProductModel.create({
                    product_id: new mongoose.Types.ObjectId(productId),
                    size_id: new mongoose.Types.ObjectId(sizeId),
                    color_id: new mongoose.Types.ObjectId(colorId),
                    quantity: 0,
                });
            }
        }
    } catch (error) {
        console.error(error);
    }
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
                sex = [],
                colors = [],
                sizes = [],
                previewImages = [],
            } = req.body;

            const newProduct = await ProductModel.create({
                category_id: categoryId,
                previewImages,
                name,
                description,
                price,
                discount,
                sex,
            });

            const [colorIds, sizeIds] = await Promise.all([
                insertColors(colors, newProduct._id),
                insertSizes(sizes, newProduct._id),
            ]);

            await initQuantities(sizeIds, colorIds, newProduct._id);

            newProduct.save();
            res.status(200).json({ product: newProduct });
        } catch (error) {
            res.status(500).json({ message: "Internal server error." });
        }
    }

    async updateQuantity(req, res) {
        try {
            const MIN_QUANTITY = 0,
                MAX_QUANTITY = 5000;

            const { productId, quantities } = req.body;

            if (productId === undefined)
                return res.status(400).json({ title: "Error", message: "product_id is undefined" });

            if (!Array.isArray(quantities)) res.status(400).json({ title: "Error", message: "quantities is invalid" });

            for (let quantityProduct of quantities) {
                const { sizeId, colorId, quantity } = quantityProduct;
                if (sizeId === undefined || colorId === undefined || quantity === undefined) {
                    return res.status(400).json({ title: "Error", message: "quantity is invalid" });
                }

                if (quantity >= MIN_QUANTITY && quantity <= MAX_QUANTITY) {
                    await QuantityProductModel.findOneAndUpdate(
                        {
                            product_id: new mongoose.Types.ObjectId(productId),
                            size_id: new mongoose.Types.ObjectId(sizeId),
                            color_id: new mongoose.Types.ObjectId(colorId),
                        },
                        { quantity }
                    );
                } else {
                    return res
                        .status(400)
                        .json({ title: "Error", message: `quantity is in (${MIN_QUANTITY}, ${MAX_QUANTITY})` });
                }
            }

            res.status(200).json({ title: "Success", message: "Update quantity successfully" });
        } catch (error) {
            res.status(500).json({ message: "Internal server error." });
        }
    }

    async filterProduct(req, res) {
        try {
            let { category, order, query, sex = "all", price, "page-size": pageSize = 8, page = 1, stock } = req.query;

            // validate queries
            category = validateNullOrUndefined(category);
            order = validateNullOrUndefined(order);
            query = validateNullOrUndefined(query);
            sex = validateNullOrUndefined(sex);
            price = validateNullOrUndefined(price);
            pageSize = validateNullOrUndefined(pageSize);
            page = validateNullOrUndefined(page);
            stock = validateNullOrUndefined(stock);
            // ----------------------------------------------------------------

            const categoryFilter = category && category !== "all" ? { category_id: category } : {};
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
                    : order === "top-rated"
                    ? { rate: -1 }
                    : { _id: 1 };

            // nếu sex là men thì vừa có sản phẩm cho men và unisex, tương ứng với women
            // nếu sex là unisex thì chi có sản phẩm cho unisex
            const sexFilter =
                sex === "unisex"
                    ? { sex }
                    : sex === "men" || sex === "women"
                    ? { $or: [{ sex }, { sex: "unisex" }] }
                    : {};
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

            const products = await ProductModel.find({
                ...categoryFilter,
                ...sexFilter,
                ...priceFilter,
                ...queryFilter,
                ...stockFilter,
            })
                .select("name previewImages price discount sold stock")
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
            res.status(500).json({ message: "Internal server error." });
        }
    }
    async getDetailsProduct(req, res) {
        try {
            const { productId } = req.params;

            const detail = await ProductModel.aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(productId),
                    },
                },
                {
                    $lookup: {
                        localField: "category_id",
                        from: "categories",
                        foreignField: "_id",
                        as: "category",
                    },
                },
                {
                    $lookup: {
                        localField: "_id",
                        from: "colorproducts",
                        foreignField: "product_id",
                        as: "colors",
                    },
                },
                {
                    $lookup: {
                        localField: "_id",
                        from: "sizeproducts",
                        foreignField: "product_id",
                        as: "sizes",
                    },
                },
                {
                    $project: {
                        _id: 1,
                        category: { _id: 1, name: 1, key: 1 },
                        previewImages: 1,
                        name: 1,
                        description: 1,
                        price: 1,
                        discount: 1,
                        sex: 1,
                        rate: 1,
                        stock: 1,
                        totalSold: 1,
                        colors: { _id: 1, product_id: 1, name: 1, hex: 1, images: 1, is_active: 1, sold: 1 },
                        sizes: { _id: 1, product_id: 1, name: 1, abbreviation: 1, description: 1, is_active: 1 },
                    },
                },
                {
                    $unwind: "$category", // làm cho thuộc tính category là một object chứ không phải mảng (mặc định sẽ dùng phần tử đầu tiên của mảng)
                },
            ]);

            res.status(200).json({
                product: { ...detail[0] },
            });
        } catch (error) {
            res.status(500).json({ message: "Internal server error." });
        }
    }

    async getProductHighestPrice(req, res) {
        try {
            const highestPriceProduct = await ProductModel.find({}).sort({ price: -1 }).limit(1);
            res.status(200).json({ price: highestPriceProduct[0].price });
        } catch (error) {
            res.status(500).json({ message: "Internal server error." });
        }
    }

    async getSuggestedProduct(req, res) {
        const LIMIT_PRODUCT = 12;
        try {
            const { category: categoryId, except: productId } = req.query;
            const products = await ProductModel.find({
                category_id: categoryId,
                _id: { $ne: new mongoose.Types.ObjectId(productId) }, // $ne: except, $nin: exclude
            })
                .sort({ rate: -1, discount: -1 })
                .limit(LIMIT_PRODUCT)
                .select("name previewImages price discount sold");

            res.status(200).json({ products });
        } catch (error) {
            res.status(500).json({ message: "Internal server error." });
        }
    }

    async getQuantityAdnSoldProduct(req, res) {
        try {
            const { "product-id": productId, "size-id": sizeId, "color-id": colorId } = req.query;
            if (!productId || !sizeId || !colorId) {
                return res.status(400).json({ title: "Error", message: "product_id, size_id, color_id is undefined" });
            }
            const quantityProduct = await QuantityProductModel.findOne({
                product_id: new mongoose.Types.ObjectId(productId),
                size_id: new mongoose.Types.ObjectId(sizeId),
                color_id: new mongoose.Types.ObjectId(colorId),
            }).select("product_id size_id color_id quantity sold");

            res.status(200).json({ ...quantityProduct._doc });
        } catch (error) {
            res.status(500).json({ message: "Internal server error." });
        }
    }

    async initStockOfProduct(req, res) {
        try {
            let products = await ProductModel.find({});
            for (let product of products) {
                let response = await QuantityProductModel.aggregate([
                    {
                        $match: {
                            product_id: product._id,
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            total_quantity: { $sum: "$quantity" },
                        },
                    },
                ]);

                let stock = response[0].total_quantity ? response[0].total_quantity : 0;

                await ProductModel.findByIdAndUpdate(product._id, { stock: stock });
            }
            res.status(200).send("success");
        } catch (error) {
            res.status(500).json({ message: "Internal server error." });
        }
    }
}

module.exports = new Product();
