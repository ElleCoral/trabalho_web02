const mongoose = require("mongoose")

const studentSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    idade: { type: Number, required: true },
    parentes: { type: String, required: true },
    numero_de_telefone: { type: String, required: true },
    necessidades_especiais: { type: String, required: true },
    status: { type: String, required: true },
  });
  
  const Student = mongoose.model('Student', studentSchema);

  module.exports = Student;