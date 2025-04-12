const User = require("../../models/user/user");
const {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
} = require("http-status-codes");
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

  res.status(StatusCodes.OK).json({
    data: user,
  });
};
