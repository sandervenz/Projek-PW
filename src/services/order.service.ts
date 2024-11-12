import OrderModel, { Order } from "../models/order.model";
import ProductsModel from "../models/products.model";
import { Types } from "mongoose";

export const createOrder = async (payload: Order): Promise<Order> => {
  // Validasi quantity
  for (const item of payload.orderItems) {
    const product = await ProductsModel.findById(item.productId);
    if (!product) throw new Error(`Product not found: ${item.productId}`);

    if (item.quantity > product.qty) {
      throw new Error(`Insufficient quantity for product ${item.name}`);
    }

    // Update product qty
    product.qty -= item.quantity;
    await product.save();
  }

  // Simpan order baru
  const order = await OrderModel.create(payload);
  return order;
};

export const findOrdersByUser = async (
  userId: Types.ObjectId,
  page: number,
  limit: number
) => {
  const skip = (page - 1) * limit;
  const orders = await OrderModel.find({ createdBy: userId })
    .skip(skip)
    .limit(limit);
  return orders;
};
