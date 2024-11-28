// feedback.controller.ts
import { Request, Response } from 'express';
import { feedbackService } from '../services/feedback.service';

class FeedbackController {
    async createFeedback(req: Request, res: Response): Promise<void> {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            res.status(400).json({ error: 'Name, email, and message are required!' });
            return;
        }

        try {
            const feedback = await feedbackService.addFeedback(name, email, message);
            res.status(201).json({ message: 'Feedback submitted successfully!', feedback });
        } catch (error) {
            console.error('Error saving feedback:', error);
            res.status(500).json({ error: 'Failed to submit feedback.' });
        }
    }
}

export const feedbackController = new FeedbackController();
