const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const UserProfileSchema = new Schema(
  {

    contact: { type: String, default: null},
    department: { type: String, default: null },
    year: { type: String, default: null },
    resumeUrl: { type: String, default: null },
    linkedinUrl: { type: String, default: null },
    portfolioUrl: { type: String, default: null },
    recruitmentApplications: [
      // Optional
      {
        recruitmentId: { type: Schema.Types.ObjectId, ref: "Recruitment" },
        appliedAt: { type: Date, default: Date.now },
      },
    ],
    following:[
        {
            societyId: {type: Schema.Types.ObjectId, ref: "Recruitment"},
            started_following: { type: Date, default: Date.now },
        }
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },

  },
  { timestamps: true }
);

const Userprofile = model("Userprofile", UserProfileSchema);
module.exports = Userprofile;
