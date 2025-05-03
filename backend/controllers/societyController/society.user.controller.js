const { StatusCodes } = require("http-status-codes");
const Society = require("../../models/society/society");

module.exports.allSocietyInfo = async (req, res) => {
  try {
    // Fetch all societies
    const societies = await Society.find();

    // Check if no societies are found

    if (!societies || societies.length === 0) {
      return res.status(404).json({ message: "No societies found" });
    }

    // Sort societies based on the number of followers (in descending order)
    societies.sort((a, b) => b.followers.length - a.followers.length);

    return res.status(StatusCodes.OK).json({
        message:"Retrieved successfully",
        societies
    })
  } catch (err) {
    console.error("Error fetching societies:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports.getsociety = async (req, res) => {
  try {
    // Fetch all societies
    const societyid=req.params.id;
    const society = await Society.findById(societyid).populate("followers");

    // Check if no societies are found

    if (!society) {
      return res.status(404).json({ message: "No such society exist" });
    }
    return res.status(StatusCodes.OK).json({
      message: "Retrieved successfully",
      society,
    });
  } catch (err) {
    console.error("Error fetching societies:", err);
    return res.status(500).json({ message: "Server error" });
  }
};