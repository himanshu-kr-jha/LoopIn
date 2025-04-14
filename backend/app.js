if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const port = 5000;
const express = require("express");
const app = express();
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const { http } = require("http-status");
const methodOverride = require("method-override");
const passport = require("passport");
const userRouter =require("./routes/user/user.route");
const authRouter = require("./routes/auth/auth.route.js");
const societyAdminRouter = require("./routes/society/society.admin.routes.js");
const societyUserRouter = require("./routes/society/society.user.routes.js");
const eventAdminRouter = require("./routes/event/event.admin.routes.js");
const eventUserRouter = require("./routes/event/event.user.routes.js");
const recruitmentAdminRouter = require("./routes/recruitment/recruitment.admin.routes");
const recruitmentUserRouter = require("./routes/recruitment/recruitment.user.routes.js");
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
    origin: "http://localhost:5173", // your React app's origin
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
app.use("/user",userRouter);
app.use("/user/recruitment",recruitmentUserRouter);
app.use("/society",societyUserRouter);
app.use("/society/admin",societyAdminRouter);
app.use("/event",eventUserRouter);
app.use("/event/admin",eventAdminRouter);
app.use("/society/recruitment",recruitmentAdminRouter);
app.get("/", (req, res) => {
  return (
    res
      .status(StatusCodes.OK)
      // .send(ReasonPhrases)
      .json({ message: "this is root page", author: "himanshu kumar jha",
        session:req.session,
      })
  );
});

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
