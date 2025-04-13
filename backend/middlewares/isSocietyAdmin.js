const jwt = require("jsonwebtoken");

const isSocietyAdmin = (req, res, next) => {
  const token = req.session.adminDetail;

  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    if (decoded.role !== "societyAdmin") {
      return res.status(403).json({ error: "Access denied" });
    }

    req.adminUser = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports= isSocietyAdmin;