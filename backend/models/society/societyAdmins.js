const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const SocietyAdminSchema = new Schema({
  societyAdmin: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  society: {
    type: Schema.Types.ObjectId,
    ref: "Society",
    required: true,
  },
  password: { type: String, required: true }, // Not required for Google users
});

const SocietyAdmin = model("SocietyAdmin", SocietyAdminSchema);

module.exports = SocietyAdmin;
