const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const SocietySchema = new Schema({
  logo: { type: String },
  name: { type: String, required: true },
  description: { type: String, required: true },
  //   mainAdmin: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the main admin
  societyAdmin: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ], // Reference to the society admin
  facultyAdvisor: {
    name: { type: String },
    email: { type: String },
    phone: { type: String },
  },
  council: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      position: { type: String },
    },
  ],
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
  ],
  achievements: [
    {
      title: { type: String },
      description: { type: String },
      date: { type: Date },
    },
  ],
  events: [
    {
      eventId: { type: Schema.Types.ObjectId, ref: "Event" },
    },
  ],
  announcements: [
    {
      title: { type: String },
      content: { type: String },
      date: { type: Date, default: Date.now() },
    },
  ],
  recruitments: [
    {
      recruitmentId: { type: Schema.Types.ObjectId, ref: "Recruitment" },
    },
  ],
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
});

// Method to check if a user is the admin of the society

const Society = model("Society", SocietySchema);

module.exports = Society;
