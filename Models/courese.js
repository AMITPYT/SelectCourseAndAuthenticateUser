const mongoose = require("mongoose");
const { Schema } = mongoose;

const CourseSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  courseName: {
    type: String,
    required: true,
  },
  creaditHour: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  course_code: {
    type: String,
    required: true,
  },
  course_info: {
    type: String,
    required: true,
  },
  instructorName: {
    type: String,
    required: true,
  },
});

const courese = mongoose.model("CouresInfo", CourseSchema);
module.exports = courese;
