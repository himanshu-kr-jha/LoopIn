const express = require("express");
const { getprofile, updateProfile } = require("../../controllers/userController/user.controller");
const router = express.Router();

router.get("/profile", getprofile);
router.post("/profile/update", updateProfile);

module.exports = router;