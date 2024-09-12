const mongoose = require("mongoose");
const { OrderModel, OrderLineModel } = require("../models");

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
                        payment_method: product.paymentMethod,
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
                .select("color_id size_id quantity price status is_paid")
                .populate("product_id", "name")
                .populate("color_id", "name images")
                .populate("size_id", "name");
            res.status(200).json({ orders });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getDetailedOrder(req, res) {
        try {
            const { _id: userId } = req.user;
            const { id: orderId } = req.params;
            let order = await OrderModel.findOne({
                buyer_id: new mongoose.Types.ObjectId(userId),
                _id: new mongoose.Types.ObjectId(orderId),
            })
                .select("payment_method address product_id color_id size_id quantity price status is_paid")
                .populate("product_id", "name sex rate stock totalSold")
                .populate("color_id", "name images hex")
                .populate("size_id", "name abbreviation description");

            res.status(200).json({ order });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async deleteOrder(req, res) {
        try {
            const { _id: userId } = req.user;
            const { id: orderId } = req.params;

            let order = await OrderModel.findOne({
                buyer_id: new mongoose.Types.ObjectId(userId),
                _id: new mongoose.Types.ObjectId(orderId),
            });

            if (!order) {
                return res.status(404).json({ message: "Order not found" });
            }

            if (order.status !== "Pending") {
                return res.status(403).json({ message: "You cannot cancel order" });
            }
            await OrderModel.findByIdAndDelete(order._id);
            res.status(200).json({ message: "Order was cancelled" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getShipCost(req, res) {
        // chức năng này chỉ tạm thời
        try {
            // giả định cửa hàng ở Quảng Bình có id là 237
            const provinceLocationId = 237;
            const { province_id: provinceId } = req.query;
            let quickDeliveryFee = 0,
                expressDeliveryFee = 0;
            if (provinceId === provinceLocationId) {
                quickDeliveryFee = 1;
                expressDeliveryFee = 0;
            } else {
                quickDeliveryFee = 3;
                expressDeliveryFee = 2;
            }
            res.status(200).json([
                { id: 1, name: "Quick Delivery", fee: quickDeliveryFee },
                { id: 2, name: "Express Delivery", fee: expressDeliveryFee },
            ]); // đơn vị: $
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new Order();
