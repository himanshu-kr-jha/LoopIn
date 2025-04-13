const { StatusCodes } = require("http-status-codes");
const Recruitment = require("../../models/society/recruitment");

module.exports.allRecruitment = async (req,res)=>{
    try {
      const recruitment = await Recruitment.find().sort({ deadline: -1 });
      res.status(200).json({
        message: "All events fetched successfully",
        recruitment,
      });
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({
        error: "Failed to fetch events",
      });
    }
}

module.exports.getRecruitment = async (req, res) => {
  try {
    const recruitmentId = req.params.Rid;
    const recruitment = await Recruitment.findOne({ _id: recruitmentId })
      .populate("societyid") // Populates society info
      .select("-applicants"); // Excludes applicants from result

    if (!recruitment) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Recruitment not found" });
    }

    res.status(StatusCodes.OK).json({
      message: "Successfully found recruitment",
      recruitment: recruitment,
    });
  } catch (error) {
    console.error("Error fetching recruitment:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to fetch recruitment",
    });
  }
}

module.exports.applyRecruitment = async (req, res) => {
  try {
    const recruitmentId = req.params.Rid;
    const userId = req.session.user.id;

    const updatedRecruitment = await Recruitment.findByIdAndUpdate(
      recruitmentId,
      {
        $push: {
          applicants: {
            user_id: userId,
            status: "Pending", // optional: can be omitted because of default
            appliedAt: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!updatedRecruitment) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Recruitment not found" });
    }

    res.status(StatusCodes.OK).json({
      message: "Applied successfully!",
      recruitment: updatedRecruitment,
    });
  } catch (error) {
    console.error("Error applying to recruitment:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Application failed" });
  }
};