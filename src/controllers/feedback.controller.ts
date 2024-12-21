import { Request, Response } from 'express';
import { feedbackService } from '../services/feedback.service';

class FeedbackController {
    async createFeedback(req: Request, res: Response): Promise<void> {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            res.status(400).json({ error: 'Nama, email, and pesan diperlukan!' });
            return;
        }

        try {
            const feedback = await feedbackService.addFeedback(name, email, message);
            res.status(201).json({ message: 'Pesan berhasil dikirim!', feedback });
        } catch (error) {
            console.error('Error saving feedback:', error);
            res.status(500).json({ error: 'Gagal mengirim pesan.' });
        }
    }
}

const feedbackController = new FeedbackController();

export default feedbackController;
