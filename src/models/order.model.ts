import mongoose, { Types } from "mongoose";

export interface OrderItem {
  name: string;
  productId: Types.ObjectId;
  price: number;
  quantity: number;
}

export interface Order {
  grandTotal: number;
  orderItems: OrderItem[];
  createdBy: Types.ObjectId;
  status: "pending" | "completed" | "cancelled";
  createdAt?: string;
  updatedAt?: string;
}

const Schema = mongoose.Schema;

const OrderSchema = new Schema<Order>(
  {
    grandTotal: {
      type: Schema.Types.Number,
      required: true,
    },
    orderItems: [
      {
        name: { type: Schema.Types.String, required: true },
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        price: { type: Schema.Types.Number, required: true },
        quantity: { type: Schema.Types.Number, required: true, min: 1, max: 5 },
      },
    ],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: Schema.Types.String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const OrderModel = mongoose.model("Order", OrderSchema);

export default OrderModel;
