if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const authRouter = require("./routes/auth/auth.route.js");
const userRouter =require("./routes/user/user.route");
const port = 5000;
const { http } = require("http-status");
const methodOverride = require("method-override");
const passport = require("passport");
const {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
} = require("http-status-codes");
//mongodb connection
const connectDB = require("./config/db");

require("./config/passport"); // Passport configuration file

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(
  cors({
    origin: "http://localhost:3000", // your React app's origin
    credentials: true, // allow credentials (cookies)
  })
);
connectDB();
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: "mongodb://localhost:27017/miniproject",
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production", // should be true in production
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", authRouter);

// app.get("/user", async (req, res) => {
//   if (!req.isAuthenticated()) {
//     return res.status(StatusCodes.UNAUTHORIZED).json({
//       message: "User not logged in or session expired",
//     });
//   }

//   const { _id } = req.user; // Passport attaches user object to req.user
//   const user = await User.findById(_id).lean();

//   if (!user) {
//     return res.status(StatusCodes.NOT_FOUND).json({
//       message: "User not found",
//     });
//   }

//   res.status(StatusCodes.OK).json({
//     data: user,
//   });
// });
app.use("/user",userRouter);



app.get("/", (req, res) => {
  return (
    res
      .status(StatusCodes.OK)
      // .send(ReasonPhrases)
      .json({ message: "this is root page", author: "himanshu kumar jha"})
  );
});

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
