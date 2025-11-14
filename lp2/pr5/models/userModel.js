const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  userType: { type: String, enum: ["owner", "seeker"], required: true },

  // Owner Section
  equipment: {
    name: { type: String },
    condition: { type: String },
    price: { type: String }
  },

  // Seeker Section
  seekerInfo: {
    needed: { type: String },
    duration: { type: String },
    location: { type: String }
  },

  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);
