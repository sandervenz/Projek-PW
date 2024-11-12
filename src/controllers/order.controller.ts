import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import OrderModel from '../models/order.model';
import ProductModel from '../models/products.model'; 
import UserModel from '../models/user.model';
import { IRequestWithUser } from "../middlewares/auth.middleware";
import mail from "../utils/mail";

// Fungsi untuk membuat order baru
async function createOrder(req: IRequestWithUser, res: Response) {
    /**
     #swagger.tags = ['Orders']
     #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/OrderRequest"
          }
        }
      }
     }
     #swagger.security = [{
       "bearerAuth": []
     }]
     */
    try {
      const { orderItems } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      let grandTotal = 0;

      for (const item of orderItems) {
        const product = await ProductModel.findById(item.productId);
        if (!product) {
          return res.status(404).json({ message: `Product not found: ${item.productId}` });
        }
        if (item.quantity > product.qty) {
          return res.status(400).json({ message: `Not enough stock for product: ${item.productId}` });
        }
        grandTotal += item.price * item.quantity;

        product.qty -= item.quantity;
        await product.save();
      }

      const newOrder = new OrderModel({
        grandTotal,
        orderItems,
        createdBy: userId,
        status: 'pending'
      });
      const savedOrder = await newOrder.save();

      const user = await UserModel.findById(userId);
      const userName = user ? user.fullName : 'Unknown';

      if (user && user.email) {
        const content = await mail.render('invoice.ejs', {
          customerName: user.fullName,
          orderItems: savedOrder.orderItems,
          grandTotal: savedOrder.grandTotal,
          contactEmail: "supportsander@example.com",
          companyName: "Toko Sander",
          year: new Date().getFullYear(),
        });

        await mail.send({
          to: user.email,
          subject: "Invoice for Your Order",
          content,
        });
      } else {
        console.log("User email not found, skipping email sending.");
      }

      res.status(201).json({
        message: 'Order created successfully',
        data: {
          ...savedOrder.toObject(),
          createdByName: userName,
        }
      });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({
        message: 'Failed to create order',
        data: err.message,
      });
    }
  }

// Menampilkan Riwayat Order Berdasarkan Pengguna
async function findAllByUser(req: IRequestWithUser, res: Response) {
    /**
     #swagger.tags = ['Orders']
     #swagger.security = [{
       "bearerAuth": []
     }]
     */   
    const userId = req.user?.id;  

    try {
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const orders = await OrderModel.find({ createdBy: userId });
 
        if (orders.length === 0) {
            return res.status(404).json({
                message: 'No orders found for this user',
                data: []
            });
        }

        res.status(200).json({
            message: 'Orders retrieved successfully',
            data: orders
        });
    } catch (error) {
        const err = error as Error;
        res.status(500).json({
            data: err.message,
            message: 'Failed to retrieve orders',
        });
    }
}
 
export { createOrder, findAllByUser };
