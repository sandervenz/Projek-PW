import mongoose, { Types } from "mongoose";

export interface Product {
  name: string;
  category: string;
  images: string;
  price: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  _id?: Types.ObjectId;
}

const Schema = mongoose.Schema;

const ProductsSchema = new Schema<Product>(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
    description: {
      type: Schema.Types.String,
      required: true,
    },
    images: {
      type: Schema.Types.String,
      required: true,
    },
    price: {
      type: Schema.Types.Number,
      required: true,
    },
    category: {
      type: Schema.Types.String, 
      required: true, 
    },
  },
  {
    timestamps: true,
  }
);

const ProductsModel = mongoose.model("Products", ProductsSchema);

export default ProductsModel;