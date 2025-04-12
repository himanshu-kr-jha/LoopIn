const express = require("express");
const { getprofile } = require("../../controllers/userController/user.controller");
const router = express.Router();

router.get("/profile", getprofile);

module.exports = router;