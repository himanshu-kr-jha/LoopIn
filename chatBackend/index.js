import express from "express"
import dotenv from "dotenv"
import connectDB from "./db/dbConnect.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import User from "./models/user.js";
import isLogin from "./middleware/isLogin.js";
import messageRouter from "./routes/message.route.js"
import userRouter from "./routes/user.route.js"
const app = express();
app.use(express.json());
app.use(cookieParser());

// Enable CORS with credentials
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend domain
    credentials: true,
  })
);
dotenv.config();
const port =process.env.PORT || 5001;

connectDB();

app.use("/api/message",isLogin,messageRouter);
app.use("/api/user",isLogin,userRouter);
app.post("/api/store-token", (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ message: "Token is required" });

  // Save token in httpOnly cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: false, // set to true in production with HTTPS
    sameSite: "Lax", // or 'Strict'/'None' based on your use
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  console.log("Token stored successfully",`${token}`);
  return res.json({ message: "Token stored in cookie successfully" });
});
// app.use("/message")
app.get("/",isLogin,(req,res)=>{
    res.json({message:"Root route", author:"himanshu kumar jha",
        data:req.user
    })
})
app.listen(port,()=>{
    console.log(`Connected to server at port: ${port}`);
})