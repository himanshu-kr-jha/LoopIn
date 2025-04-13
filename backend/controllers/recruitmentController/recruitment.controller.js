const Recruitment = require("../../models/society/recruitment");
const Society = require("../../models/society/society");

module.exports.postRecruitment = async (req, res) => {
  try {
    const {
      title,
      description,
      tags,
      jobdetails,
      eligibility,
      deadline,
    } = req.body;

    const societyId = req.adminUser?.societyId; // Assumes middleware sets adminUser
    if (!societyId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No society ID found" });
    }

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    const newRecruitment = new Recruitment({
      title,
      description,
      tags: tags || [],
      jobdetails: (jobdetails || []).map((point) => ({ points: point })),
      eligibilty: (eligibility || []).map((point) => ({ points: point })),
      deadline,
      societyid: societyId,
    });

    const savedRecruitment = await newRecruitment.save();
    const society = await Society.findByIdAndUpdate(
      societyId,
      {
        $push: {
          recruitments: { recruitmentId: savedRecruitment._id },
        },
      },
      { new: true } // returns the updated document
    );

    res.status(201).json({
      message: "Recruitment created successfully",
      recruitment: savedRecruitment,
      society:society
    });
  } catch (error) {
    console.error("Error creating recruitment:", error);
    res
      .status(500)
      .json({ message: "Server error while creating recruitment" });
  }
};


module.exports.getApplicants = async (req, res) => {
  try {
    const recruitmentId = req.params.Rid;

    const recruitment = await Recruitment.findById(recruitmentId)
      .select("applicants")
      .populate("applicants.user_id"); // Populate user details

    if (!recruitment) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Recruitment not found" });
    }

    res.status(StatusCodes.OK).json({
      message: "Applicants fetched successfully",
      applicants: recruitment.applicants,
    });
  } catch (error) {
    console.error("Error fetching applicants:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to fetch applicants" });
  }
};