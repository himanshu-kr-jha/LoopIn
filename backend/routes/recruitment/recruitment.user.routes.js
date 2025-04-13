const express = require("express");
const Recruitment = require("../../models/society/recruitment");
const { StatusCodes } = require("http-status-codes");
const { getRecruitment, applyRecruitment, allRecruitment } = require("../../controllers/recruitmentController/recruitment.user.controller");
const router = express.Router();

router.get("/all",allRecruitment);
router.get("/:Rid",getRecruitment);
router.post("/apply/:Rid",applyRecruitment);

module.exports = router;
