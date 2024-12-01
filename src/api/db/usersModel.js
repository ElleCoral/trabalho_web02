const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    pwd: { type: String, required: true },
    level: { type: String, required: true },
    status: { type: String, required: true },
  });
  
  const User = mongoose.model("User", UserSchema);

  module.exports = User;