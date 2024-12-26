import { Request, Response } from 'express';
import OrderModel from '../models/order.model';

async function changeOrderStatus(req: Request, res: Response) {
  try {
    const { id } = req.params; // Order ID
    const { status } = req.body; // New status

    // Validate status
    const validStatuses = ['menunggu', 'selesai', 'dibatalkan'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Status tidak valid. Status yang valid adalah: menunggu, selesai, dibatalkan.',
      });
    }

    // Find the order by ID and update its status
    const order = await OrderModel.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Pesanan tidak ditemukan.' });
    }

    order.status = status;
    const updatedOrder = await order.save();

    res.status(200).json({
      message: 'Pesanan berhasil diperbarui',
      data: updatedOrder,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      message: 'Gagal memperbarui status pesanan',
      data: err.message,
    });
  }
}

export default changeOrderStatus;
