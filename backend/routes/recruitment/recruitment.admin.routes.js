const express = require("express");
const router = express.Router();
const isSocietyAdmin = require("../../middlewares/isSocietyAdmin");

const { postRecruitment, getApplicants } = require("../../controllers/recruitmentController/recruitment.controller");
const Recruitment = require("../../models/society/recruitment");
const { StatusCodes } = require("http-status-codes");

// @route   POST /recruitment/add
// @desc    Add a new recruitment
// @access  Private (admin only)
router.post("/add",isSocietyAdmin,postRecruitment);

router.get("/applicants/:Rid",getApplicants);

module.exports = router;


module.exports = router;
