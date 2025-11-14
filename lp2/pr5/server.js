const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const User = require("./models/userModel");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Replace this with your MongoDB Atlas connection string
mongoose.connect(
  "",
  { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// 🧾 User Registration route
app.post("/registerUser", async (req, res) => {
  try {
    const { name, email, password, userType, equipment, seekerInfo } = req.body;

    if (!name || !email || !password || !userType) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Build User Object
    const userData = {
      name,
      email,
      password: hashedPassword,
      userType
    };

    // If user is OWNER → add equipment info
    if (userType === "owner" && equipment) {
      userData.equipment = {
        name: equipment.name,
        condition: equipment.condition,
        price: equipment.price
      };
    }

    // If user is SEEKER → add seeker info
    if (userType === "seeker" && seekerInfo) {
      userData.seekerInfo = {
        needed: seekerInfo.needed,
        duration: seekerInfo.duration,
        location: seekerInfo.location
      };
    }

    // Save in DB
    const newUser = new User(userData);
    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ message: "Server error while registering user" });
  }
});


// 🔑 User Login route
app.post("/loginUser", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    res.json({ message: "Login successful!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// 🌍 Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));


// mkdir agrorent-server
// cd agrorent-server
// npm init -y
// npm install express mongoose cors body-parser
// npm install express mongoose cors body-parser bcryptjs
// node server.js
