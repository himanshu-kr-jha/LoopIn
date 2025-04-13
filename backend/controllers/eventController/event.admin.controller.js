const Event = require("../../models/events/event"); // Adjust path as needed
const Society = require("../../models/society/society");

module.exports.addEvent = async (req, res) => {
  try {
    const societyId = req.adminUser.societyId; // Extracted from token/session
    const {
      title,
      description,
      date,
      time,
      location,
      registrationURL,
      category,
    } = req.body;

    // Validation (optional but recommended)
    if (!title || !description || !date || !time || !location || !category) {
      return res
        .status(400)
        .json({ error: "All required fields must be filled." });
    }

    const newEvent = new Event({
      societyId,
      title,
      description,
      date,
      time,
      location,
      registrationURL,
      category,
    });

    await newEvent.save();
    const society = await Society.findByIdAndUpdate(
      societyId,
      {
        $push: {
          events: { eventId: newEvent._id },
        },
      },
      { new: true } // returns the updated document
    );
    res
      .status(201)
      .json({
        message: "Event created successfully",
        event: newEvent,
        society: society,
      });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};