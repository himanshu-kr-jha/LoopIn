const Event = require("../../models/events/event")
const { google } = require("googleapis");
const UserCalendar = require("../../models/events/userEventCalendar");

module.exports.allEvent = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 }); // sorted by latest first
    res.status(200).json({
      message: "All events fetched successfully",
      events,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({
      error: "Failed to fetch events",
    });
  }
};

module.exports.getEvent = async(req,res)=>{
    try{
        const eventid = req.params.Eid;
        const access_token = req.session.user.googleAccessToken;
        console.log(access_token);
        const event = await Event.findById(eventid);
        res.status(200).json({
          message: "Event fetched successfully",
          event,
        });
    }catch(error){
        console.error("Error fetching events:", error);
        res.status(500).json({
          error: "Failed to fetch events",
        });
    }
}

module.exports.addtocalendar = async (req, res) => {
  try {
    const { recurrence, notifyEmail, notifyPopup } = req.body;
    const eventId = req.params.Eid;

    const fetchedevent = await Event.findById(eventId);
    if (!fetchedevent) {
      return res.status(404).json({ message: "Event not found" });
    }

    const oauth2Client = new google.auth.OAuth2();
    const token = req.session?.user?.googleAccessToken;
    if (!token) {
      return res.status(401).json({ message: "Google access token not found" });
    }

    oauth2Client.setCredentials({ access_token: token });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    const eventDate = new Date(fetchedevent.date); // "2025-04-30T09:00:00.000Z"
    const [time, meridian] = fetchedevent.time.split(" "); // "09:00", "AM"
    const [hours, minutes] = time.split(":").map(Number);

    // Convert 12-hour to 24-hour
    let hour24 = hours;
    if (meridian === "PM" && hours !== 12) hour24 += 12;
    if (meridian === "AM" && hours === 12) hour24 = 0;

    eventDate.setHours(hour24, minutes, 0);
    const startDateTime = new Date(eventDate);
    const endDateTime = new Date(startDateTime);
    endDateTime.setHours(startDateTime.getHours() + 1);


    const event = {
      summary: fetchedevent.title,
      description: fetchedevent.description,
      location: fetchedevent.location,
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: "Asia/Kolkata",
      },
      recurrence: recurrence ? [`RRULE:FREQ=${recurrence.toUpperCase()}`] : [],
      reminders: {
        useDefault: false,
        overrides: [
          ...(notifyEmail ? [{ method: "email", minutes: 30 }] : []),
          ...(notifyPopup ? [{ method: "popup", minutes: 10 }] : []),
        ],
      },
    };

    const response = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
    });

    const userCalendarEntry = new UserCalendar({
      userId: req.session.user.id,
      event: eventId,
    });

    const savedData = await userCalendarEntry.save();

    res.status(201).json({
      message: "Event added to Google Calendar",
      event: response.data,
    });
  } catch (error) {
    console.error("Error creating Google Calendar event:", error);
    res
      .status(500)
      .json({ message: "Failed to create event in Google Calendar" });
  }
};
