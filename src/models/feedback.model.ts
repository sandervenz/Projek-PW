import mongoose, { Schema, Document } from 'mongoose';

export interface FeedbackDocument extends Document {
    name: string;
    email: string;
    message: string;
    createdAt: Date;
}

const FeedbackSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export const FeedbackModel = mongoose.model<FeedbackDocument>('Feedback', FeedbackSchema);
