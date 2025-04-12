const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const RecruitmentSchema = new Schema({
  coverimage: { type: String },
  title: { type: String, required: true },
  description: { type: String, required: true },
  societyid: { type: Schema.Types.ObjectId, ref: "Society", required: true }, // Reference to the main admin
  tags: [{ type: String }], // Array of tags (e.g., "Technical", "Leadership")
  jobdetails: [
    {
      points: { type: String },
    },
  ],
  eligibilty: [
    {
      points: { type: String },
    },
  ],
  deadline: { type: Date },
  applicants: [
    {
      user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
      status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending",
      },
      appliedAt: { type: Date, default: Date.now },
    },
  ],
});

// Method to check if a user is the admin of the society

const Recruitment = model("Recruitment", RecruitmentSchema);

module.exports = Recruitment;
