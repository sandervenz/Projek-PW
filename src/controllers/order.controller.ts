import { Request, Response } from 'express';
import OrderModel from '../models/order.model';
import mail from '../utils/mail';

async function createOrder(req: Request, res: Response) {
  try {
    const { orderItems, username, email, telp, table } = req.body;

    if (!username) {
      return res.status(400).json({ message: 'Nama diperlukan.' });
    }
    
    if (!email) {
      return res.status(400).json({ message: 'Email diperlukan.' });
    }
    
    if (!telp) {
      return res.status(400).json({ message: 'Nomor telepon diperlukan.' });
    }
    
    if (!table) {
      return res.status(400).json({ message: 'Nomor meja diperlukan.' });
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
      username,
      email,
      telp,
      table,
      status: 'menunggu',
    });

    const savedOrder = await newOrder.save();

    // Kirim email jika email tersedia
    if (email) {
      const emailContent = await mail.render('invoice.ejs', {
        customerEmail: email,
        orderItems: savedOrder.orderItems,
        grandTotal: savedOrder.grandTotal,
        username: savedOrder.username,
        contactEmail: "foodscoop@example.com",
        companyName: "FoodScoop",
        year: new Date().getFullYear(),
      });

      await mail.send({
        to: email,
        subject: "Struk untuk Pesanan Anda",
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
    const { username, email, telp, table } = req.query;

    const query: any = {};
    if (username) query.username = username;
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
