import OrderModel, { Order } from "../models/order.model";

export const createOrder = async (payload: Order): Promise<Order> => {

  // Save the new order
  const order = await OrderModel.create(payload);
  return order;
};

export const findOrders = async (
  page: number,
  limit: number,
  filters?: { username?: string; email?: string; telp?: string; table?: string }
) => {
  const skip = (page - 1) * limit;

  // Construct query filters
  const query: any = {};
  if (filters?.username) query.username = filters.username;
  if (filters?.email) query.email = filters.email;
  if (filters?.telp) query.telp = filters.telp;
  if (filters?.table) query.table = filters.table;

  const orders = await OrderModel.find(query)
    .skip(skip)
    .limit(limit);
  return orders;
};
