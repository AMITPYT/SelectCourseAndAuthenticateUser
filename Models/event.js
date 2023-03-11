const mongoose = require("mongoose");
const { Schema } = mongoose;

const EventSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  eventType: {
    type: String,
  },
  eventName: {
    type: String,
  },
  eventDate: {
    type: String,
  },
});

const Event = mongoose.model("Event", EventSchema);
module.exports = Event;
