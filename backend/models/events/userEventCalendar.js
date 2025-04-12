const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const UserEventCalendar = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  event: {
    type: Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
});

const UserCalendar = model("UserEventCalendar", UserEventCalendar);

module.exports = UserCalendar;
