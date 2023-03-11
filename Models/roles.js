const mongoose = require("mongoose");
const { Schema } = mongoose;

const RoleSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  role: {
    type: String,
    default: "User",
  },
});

const role = mongoose.model("Role", RoleSchema);
module.exports = role;
