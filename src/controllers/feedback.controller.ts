import { Request, Response } from 'express';
import { feedbackService } from '../services/feedback.service';
import sendMail from '../utils/mail/sendmail';

class FeedbackController {
    async createFeedback(req: Request, res: Response): Promise<void> {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            res.status(400).json({ error: 'Nama, email, dan pesan diperlukan!' });
            return;
        }

        try {
            // Simpan feedback ke database
            const feedback = await feedbackService.addFeedback(name, email, message);

            // Kirim email ke admin Zoho
            const adminEmail = 'foodscoop@zohomail.com';
            const subject = `Pesan dari ${name}`;
            const content = `
                <p><strong>Nama:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Pesan:</strong></p>
                <p>${message}</p>
            `;

            await sendMail({
                from: email,
                to: adminEmail,
                subject,
                content,
            });

            res.status(201).json({ message: 'Pesan berhasil dikirim!', feedback });
        } catch (error) {
            console.error('Error saving feedback:', error);
            res.status(500).json({ error: 'Gagal mengirim pesan.' });
        }
    }
}

const feedbackController = new FeedbackController();
export default feedbackController;
