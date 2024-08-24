const mongoose = require("mongoose");
const { OrderModel, OrderLineModel } = require("../models");

const createOrderLine = async (products, orderId) => {
    try {
        for (let product of products) {
            await OrderLineModel.create({
                product_id: new mongoose.Types.ObjectId(product.productId),
                size_id: new mongoose.Types.ObjectId(product.sizeId),
                color_id: new mongoose.Types.ObjectId(product.colorId),
                quantity: product.quantity,
                price: product.price,
                status: product.status,
                is_paid: product.isPaid,
                order_id: new mongoose.Types.ObjectId(orderId),
            });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

class Order {
    async createOrder(req, res) {
        try {
            // each item of products must include productId, sizeId, colorId quantity, price, status(or not), isPaid(or not), address, paymentMethod
            const { products = [] } = req.body;
            const { _id: userId } = req.user;

            try {
                for (let product of products) {
                    let { street, city, state, postalCode, country } = product.address;

                    await OrderModel.create({
                        buyer_id: new mongoose.Types.ObjectId(userId),
                        paymentMethod: product.paymentMethod,
                        address: {
                            street,
                            city,
                            state,
                            postalCode,
                            country,
                        },
                        product_id: new mongoose.Types.ObjectId(product.productId),
                        color_id: new mongoose.Types.ObjectId(product.colorId),
                        size_id: new mongoose.Types.ObjectId(product.sizeId),
                        quantity: product.quantity,
                        price: product.price,
                        status: product.status,
                        is_paid: product.isPaid,
                    });
                }
            } catch (error) {
                return res.status(406).json({ message: "Order was rejected" });
            }
            res.status(200).json({ message: "Order was accepted" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getOrders(req, res) {
        try {
            const { _id: userId } = req.user;
            const { limit, page } = req.query;
            let skip = (page - 1) * limit;
            console.log(userId);
            let orders = await OrderModel.find({ buyer_id: userId })
                .skip(skip)
                .limit(limit)
                .populate("product_id", "name")
                .populate("color_id", "name images")
                .populate("size_id", "name");
            res.status(200).json({ orders });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new Order();
