const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../../models/user/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const { StatusCodes } = require("http-status-codes");

router.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: "mongodb://localhost:27017/miniproject",
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);
// Google OAuth login
router.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      "profile",
      "email",
      "https://www.googleapis.com/auth/calendar.events", // Allow event creation
      "https://www.googleapis.com/auth/calendar", // Full calendar access
    ],
    accessType: "offline",
    prompt: "consent",
  })
);


router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    if (!req.user) {
      return res.redirect("/");
    }

    // Store access token & refresh token in session
    // console.log("access toeknt -----------============-----------",req);
    // req.session.accessToken = req.user.googleAccessToken;
    req.session.user=req.user;
    res.redirect(
      `http://localhost:5173/auth-success?token=${req.user.token}`
    );
    
  }
);

// Logout route
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy(() => {
      res.redirect("/");
    });
  });
});

router.post("/guest-login", async (req, res) => {
  try {
    // Create a unique guest user
    const guestUser = new User({
      name: "Guest User",
      email: `guest_${Date.now()}@stucobeGuest.com`,
      password: "guest123", // Store hashed password if required
      isGuest: true,
    });

    await guestUser.save();

    // Generate token
    const token = jwt.sign(
      { id: guestUser._id, isGuest: true },
      process.env.JWT_TOKEN,
      { expiresIn: "1h" }
    );
    req.session.token = token;
    // req.session.accessToken = req.user.googleAccessToken;
    console.log(req.session);
    res.redirect("/society/all");
    // res.json({ token, user: guestUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error logging in as guest" });
  }
});

module.exports = router;
