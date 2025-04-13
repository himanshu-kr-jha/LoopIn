const User = require("../models/user/user");

const isMainAdmin = async (req, res, next) => {
  const id = req.user._id;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }

    // Check if the logged-in user is the main admin
    if (String(user.email) !== String(process.env.MAIN_ADMIN_EMAIL)) {
      return res
        .status(403)
        .json({ error: "You are not the main admin" });
    }

    // Attach society to request if needed later
    req.mainAdmin=true;

    // Move to the next middleware or controller
    next();
  } catch (error) {
    console.error("Main admin check error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = isMainAdmin;
