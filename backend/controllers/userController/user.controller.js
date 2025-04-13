const User = require("../../models/user/user");
const {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
} = require("http-status-codes");
const Userprofile = require("../../models/user/userProfile");

module.exports.getprofile = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "User not logged in or session expired",
    });
  }

  const { _id } = req.user; // Passport attaches user object to req.user
  const user = await User.findById(_id).lean();

  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({
      message: "User not found",
    });
  }
  const profile = await Userprofile.findOne({userid:_id});
  res.status(StatusCodes.OK).json({
    data: user,
    profile:profile
  });
};

module.exports.updateProfile = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "User not logged in or session expired",
    });
  }

  const { _id } = req.user;
  const { contact, department, year, resumeUrl, linkedinUrl, portfolioUrl } =
    req.body;

  try {
    const user = await User.findById(_id).lean();
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "User not found",
      });
    }

    const updates = {
      contact,
      department,
      year,
      resumeUrl,
      linkedinUrl,
      portfolioUrl,
    };

    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );

    // Check if the profile already exists
    let userProfile = await Userprofile.findOne({ userid: _id });

    if (!userProfile) {
      // If no profile, create one
      userProfile = new Userprofile({
        userid: _id,
        ...filteredUpdates,
      });
    } else {
      // If exists, update fields
      Object.assign(userProfile, filteredUpdates);
      userProfile.updatedAt = Date.now(); // Optional: manually set updatedAt
    }

    await userProfile.save();

    return res.status(StatusCodes.OK).json({
      message: userProfile.isNew
        ? "Profile created successfully"
        : "Profile updated successfully",
      user: userProfile,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "An error occurred while updating the profile",
    });
  }
};
