const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  specialty: { type: String, required: true },  
  comments: { type: String, required: true },   
  date: { type: Date, required: true },        
  student: { type: String, required: true },    
  professional: { type: String, required: true },
}, {
  timestamps: true, 
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
