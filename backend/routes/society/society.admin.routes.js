const express = require("express");
const router = express.Router();
const { createSociety, adminLogin } = require("../../controllers/societyController/society.controller");
const isMainAdmin = require("../../middlewares/mainAdmin");

router.post("/login",adminLogin);
router.post("/create-society",isMainAdmin,createSociety);

module.exports=router;