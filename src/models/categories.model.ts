/**
 * src/models/categories.models.ts
 */
import mongoose, { Types } from "mongoose";

export interface Category {
  _id?: Types.ObjectId;
  name: string;
  createdAt: string;
  updatedAt: string;
}

const Schema = mongoose.Schema;

const CategoriesSchema = new Schema<Category>(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const CategoriesModel = mongoose.model("Categories", CategoriesSchema);

export default CategoriesModel;
