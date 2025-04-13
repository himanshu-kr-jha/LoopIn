const express = require("express");
const { allSocietyInfo, getsociety } = require("../../controllers/societyController/society.user.controller");
const { route } = require("./society.admin.routes");
const Society = require("../../models/society/society");
const User = require("../../models/user/user");
const Userprofile = require("../../models/user/userProfile");
const router = express.Router();

router.get("/all",allSocietyInfo);
router.get("/:id", getsociety);
router.post("/follow/:id", async (req, res) => {
  try {
    const societyId = req.params.id;
    const userId = req.session.user.id;

    const society = await Society.findById(societyId);
    if (!society) {
      return res.status(404).json({ error: "Society not found" });
    }

    // Add user to society followers if not already present
    if (!society.followers.includes(userId)) {
      society.followers.push(userId);
      await society.save();
    }

    // Add society to user's following list if not already present
    const user = await Userprofile.findOne({ userid: userId });
    if (!user) {
      return res.status(404).json({ error: "Update your profile before following any society." });
    }
    const alreadyFollowing =
      Array.isArray(user.following) &&
      user.following.some((entry) => entry.societyId.toString() === societyId);


    if (!alreadyFollowing) {
      user.following.push({
        societyId: societyId,
        started_following: new Date(),
      });
      await user.save();
    }

    return res
      .status(200)
      .json({ message: "You are now following the society" });
  } catch (error) {
    console.error("Follow error:", error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports=router