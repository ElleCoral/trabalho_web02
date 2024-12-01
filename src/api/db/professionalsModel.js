const mongoose = require("mongoose");

const ProfessionalSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    specialty: { type: String, required: true },
    contact: { type: String, required: true },
    phone_number: { type: String, required: true },
    status: { type: String, required: true },
  });
  
  const Professional = mongoose.model("Professional", ProfessionalSchema);
  
  module.exports = Professional;

  