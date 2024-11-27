import { Request, Response } from 'express';
import OrderModel from '../models/order.model';
import ProductModel from '../models/products.model';
import mail from '../utils/mail';

async function createOrder(req: Request, res: Response) {
  try {
    const { orderItems, email, telp, table } = req.body;

    if (!table) {
      return res.status(400).json({ message: 'Table number is required.' });
    }

    let grandTotal = 0;

    // Proses item pesanan tanpa validasi `productId`
    for (const item of orderItems) {
      const price = item.price || 0; 
      const total = price * item.quantity;
      grandTotal += total;
    }

    const newOrder = new OrderModel({
      grandTotal,
      orderItems,
      email,
      telp,
      table,
      status: 'pending',
    });

    const savedOrder = await newOrder.save();

    // Kirim email jika email tersedia
    if (email) {
      const emailContent = await mail.render('invoice.ejs', {
        customerEmail: email,
        orderItems: savedOrder.orderItems,
        grandTotal: savedOrder.grandTotal,
        contactEmail: "foodscoop@example.com",
        companyName: "FoodScoop",
        year: new Date().getFullYear(),
      });

      await mail.send({
        to: email,
        subject: "Invoice for Your Order",
        content: emailContent,
      });
    }

    res.status(201).json({
      message: 'Order created successfully',
      data: savedOrder,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      message: 'Failed to create order',
      data: err.message,
    });
  }
}

async function findAllOrders(req: Request, res: Response) {
  try {
    const { email, telp, table } = req.query;

    const query: any = {};
    if (email) query.email = email;
    if (telp) query.telp = telp;
    if (table) query.table = table;

    const orders = await OrderModel.find(query);

    if (orders.length === 0) {
      return res.status(404).json({
        message: 'No orders found',
        data: [],
      });
    }

    res.status(200).json({
      message: 'Orders retrieved successfully',
      data: orders,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      message: 'Failed to retrieve orders',
      data: err.message,
    });
  }
}

export { createOrder, findAllOrders };
