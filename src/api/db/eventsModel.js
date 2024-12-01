const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    description: { type: String, required: true },
    comments: { type: String, required: true },
    date: { type: Date, required: true },
    status: { type: String, required: true, default: 'active' }, 
  });
  
  const Event = mongoose.model("Event", eventSchema);

  module.exports = Event;
