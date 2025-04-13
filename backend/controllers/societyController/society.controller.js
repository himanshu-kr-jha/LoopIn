const Society = require("../../models/society/society");
const User = require("../../models/user/user");
const SocietyAdmin = require("../../models/society/societyAdmins");
const crypto = require("crypto"); // for secure random password
const bcrypt = require("bcrypt"); // if you want to hash the password
const sendEmail = require("../../utils/sendEmails");
const jwt = require("jsonwebtoken");

module.exports.adminLogin = async (req, res) => {
  const { societyEmail, userEmail, password } = req.body;

  if (!societyEmail || !userEmail || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Find the society
    const society = await Society.findOne({ societyEmail });
    if (!society) {
      return res.status(404).json({ error: "Society not found" });
    }

    // Find the user
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if user is a society admin for this society
    const societyAdmin = await SocietyAdmin.findOne({
      society: society._id,
      societyAdmin: user._id,
    });

    if (!societyAdmin) {
      return res
        .status(403)
        .json({ error: "User is not an admin for this society" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, societyAdmin.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: "societyAdmin", societyId: society._id },
      process.env.JWT_TOKEN,
      { expiresIn: "1d" }
    );
    
    req.session.adminDetail = token;
    
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      society: {
        id: society._id,
        name: society.name,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


module.exports.createSociety = async (req, res) => {
  const { name, description, societyEmail, societyAdminEmail } = req.body;

  // Input validation
  if (!name || !description || !societyAdminEmail || !societyEmail) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Get main admin from authenticated user
    const mainAdmin = req.user;
    if (!mainAdmin) {
      return res.status(401).json({ error: "Unauthorized: Admin not found" });
    }

    // Update role of the user to societyAdmin
    const societyAdmin = await User.findOneAndUpdate(
      { email: societyAdminEmail },
      { role: "societyAdmin" },
      { new: true }
    );

    if (!societyAdmin) {
      return res
        .status(400)
        .json({ error: "User not found with the provided email" });
    }

    // Create the new society
    const newSociety = new Society({
      name,
      description,
      societyEmail,
      societyAdmin: [societyAdmin._id],
      mainAdmin: mainAdmin._id,
    });

    const savedSociety = await newSociety.save();

    // Generate a secure random password
    const plainPassword = crypto.randomBytes(8).toString("hex"); // 16-character password

    // Hash the password (optional but recommended)
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const newAdmin = new SocietyAdmin({
      society: savedSociety._id,
      societyAdmin: societyAdmin._id,
      password: hashedPassword, // store hashed password
    });

    await newAdmin.save();
    await sendEmail(
      societyAdminEmail,
"🎉 Welcome as Society Admin on LoopIn",
`Hello ${societyAdmin.name},
You have been assigned as a Society Admin for the society: "${name}" on LoopIn.

Here are your initial login credentials:
Email: ${societyAdmin.email}
Temporary Password: ${plainPassword}

Please log in and change your password after your first login.

Best,
LoopIn Team`
    );

    res.status(201).json({
      message: "Society created successfully!",
      society: savedSociety,
      adminGeneratedPassword: plainPassword, // Send plain password for initial login or email
    });
  } catch (err) {
    console.error("Error creating society:", err);
    res.status(500).json({
      error: "Error creating society.",
    });
  }
};
