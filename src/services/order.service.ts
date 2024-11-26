import OrderModel, { Order } from "../models/order.model";
import ProductsModel from "../models/products.model";

export const createOrder = async (payload: Order): Promise<Order> => {
  // Validate if all products exist, without updating their stock
  for (const item of payload.orderItems) {
    const product = await ProductsModel.findById(item.productId);
    if (!product) throw new Error(`Product not found: ${item.productId}`);
  }

  // Save the new order
  const order = await OrderModel.create(payload);
  return order;
};

export const findOrders = async (
  page: number,
  limit: number,
  filters?: { email?: string; telp?: string; table?: string }
) => {
  const skip = (page - 1) * limit;

  // Construct query filters
  const query: any = {};
  if (filters?.email) query.email = filters.email;
  if (filters?.telp) query.telp = filters.telp;
  if (filters?.table) query.table = filters.table;

  const orders = await OrderModel.find(query)
    .skip(skip)
    .limit(limit);
  return orders;
};
