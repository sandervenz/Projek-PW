import { Request, Response } from 'express';
import OrderModel from '../models/order.model';

async function changeOrderStatus(req: Request, res: Response) {
  try {
    const { id } = req.params; // Order ID
    const { status } = req.body; // New status

    // Validate status
    const validStatuses = ['pending', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Invalid status. Valid statuses are: pending, completed, cancelled.',
      });
    }

    // Find the order by ID and update its status
    const order = await OrderModel.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    order.status = status;
    const updatedOrder = await order.save();

    res.status(200).json({
      message: 'Order status updated successfully',
      data: updatedOrder,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      message: 'Failed to update order status',
      data: err.message,
    });
  }
}

export { changeOrderStatus };
