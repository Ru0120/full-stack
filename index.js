import express from "express";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { connectDB } from "./views/config.js";
import { User, Users } from "./views/config.js";
import cors from "cors";

const app = express();

dotenv.config();
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

// app.post("/signup", async (req, res) => {
//   const data = {
//     email: req.body.email,
//     password: req.body.password,
//   }

//   const userData = await User.insertMany(data);
//   console.log(userData);

//   const userAlreadyExists = await User.findOne({ email:data.email });
//     if (userAlreadyExists) {
//       throw new Error("User already exists");
//     }else

//     const  hashedPassword = await User.hashPassword(password, 10);

//     data.password=hashedPassword;

//     const usersData= await User.insertMany(data);
//     console.log(usersData);

//     res.send("User registered successfully!");
// });

// const generateToken = (res, userId) => {
//   const generateToken = (res, userId) => {
//     const token = jwt.sign({ userId }, process.env.JWT_SECRET);
//     res.cookie("token", token);
//     return token;
//   };
app.post("/signup", async (req, res) => {
  try {
    const data = {
      email: req.body.email,
      password: req.body.password,
    };

    console.log(data);

    await Users.signup(data);

    res.send({ success: true });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const check = await User.findOne({ email: req.body.email });

    if (!check) {
      res.send("User name cannot found");
    }

    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      check.password
    );

    if (!isPasswordMatch) {
      res.send("wrong Password");
    }

    const token = check.getToken();

    res.send(token);
  } catch {
    res.send("wrong Details");
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
