const express = require("express");
const router = express.Router();
const isSocietyAdmin = require("../../middlewares/isSocietyAdmin");
const { addEvent } = require("../../controllers/eventController/event.admin.controller");

// Route: POST /events/add
router.post("/add", isSocietyAdmin, addEvent);

module.exports = router;
