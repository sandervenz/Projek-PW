import mongoose from "mongoose";
import { encrypt } from "../utils/encryption";

export interface User {
  username: string;
  password: string;
  createdAt?: string;
}

const Schema = mongoose.Schema;

const UserSchema = new Schema<User>(
  {
    username: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    password: {
      type: Schema.Types.String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt the password before saving
UserSchema.pre("save", function (next) {
  const user = this;
  user.password = encrypt(user.password);
  next();
});

// Encrypt the password before updating
UserSchema.pre("updateOne", async function (next) {
  const user = (this as unknown as { _update: any })._update as User;
  user.password = encrypt(user.password);
  next();
});

// Remove password from the output when converting to JSON
UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
