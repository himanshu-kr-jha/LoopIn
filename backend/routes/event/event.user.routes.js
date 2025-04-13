const express = require("express");
const {
  allEvent,
  getEvent,
  addtocalendar,
} = require("../../controllers/eventController/event.user.controller");
const router = express.Router();


router.get("/allevent", allEvent);
router.get("/:Eid", getEvent);
router.post("/:Eid/create-event-google",addtocalendar);

module.exports = router;
