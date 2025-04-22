import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected");
  } catch (error) {
    console.error(Error);
  }
};

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    lastlogin: {
      type: Date,
      default: Date.now,
    },
    resetPasswordToken: String,
  },

  { timestamps: true, collection: "User" }
);

export class Users {
  getToken() {
    const token = jwt.sign({ userId: this._id }, process.env.JWT_SECRET);
    return token;
  }

  static async signup(data) {
    const existingUser = await User.findOne({ email: data.email });

    if (existingUser) {
      throw new Error("User already exists.");
    } else {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(data.password, saltRounds);

      data.password = hashedPassword;

      const userdata = await User.create(data);

      return userdata;
    }
  }
}

userSchema.loadClass(Users);

export const User = new mongoose.model("User", userSchema);
