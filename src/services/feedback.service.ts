// feedback.service.ts
import { FeedbackModel, FeedbackDocument } from '../models/feedback.model';

class FeedbackService {
    // Tambahkan feedback baru ke database
    async addFeedback(name: string, email: string, message: string): Promise<FeedbackDocument> {
        const newFeedback = new FeedbackModel({ name, email, message });
        return await newFeedback.save(); // Simpan ke database
    }
}

export const feedbackService = new FeedbackService();
