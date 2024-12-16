import mongoose, { Types } from "mongoose";

export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  grandTotal: number;
  orderItems: OrderItem[];
  username: string;
  email: string; 
  telp: string; 
  table: string; 
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
        price: { type: Schema.Types.Number, required: true },
        quantity: { type: Schema.Types.Number, required: true },
      },
    ],
    username: {
      type: Schema.Types.String,
      required: true,
    },
    email: {
      type: Schema.Types.String,
      required: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    telp: {
      type: Schema.Types.String,
      required: true,
    },
    table: {
      type: Schema.Types.String,
      required: true,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: false },
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
