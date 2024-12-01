const mongoose = require("mongoose")

const teacherSchema = new mongoose.Schema({
    name: { type: String, required: true },
    school_disciplines: { type: String, required: true },
    contact: { type: String, required: true },
    phone_number: { type: String, required: true },
    status: { type: String, required: true },
  });
  
  const Teacher = mongoose.model("Teacher", teacherSchema);

  module.exports = Teacher;