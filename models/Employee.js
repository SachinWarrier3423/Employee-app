const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  name: String,
  age: Number,
  email: String,
  dob: Date,
  experience: Number,
  gender: String,
  department: String,
  skills: [String],
  address: String,
});

module.exports = mongoose.model("Employee", EmployeeSchema);
