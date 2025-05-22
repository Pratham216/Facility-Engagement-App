const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const Feedback = require("./models/Feedback");
const ServiceRequest = require("./models/ServiceRequest");
const GameScore = require("./models/GameScore");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Feedback routes
app.post("/api/feedback", async (req, res) => {
  try {
    const { feedback, rating } = req.body;
    
    if (!feedback || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Invalid feedback data" });
    }

    const newFeedback = new Feedback({ feedback, rating });
    const savedFeedback = await newFeedback.save();
    res.status(201).json(savedFeedback);
  } catch (error) {
    console.error("Error saving feedback:", error);
    res.status(500).json({ error: "Failed to save feedback" });
  }
});

app.get("/api/feedback", async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ timestamp: -1 });
    res.json(feedbacks);
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    res.status(500).json({ error: "Failed to fetch feedbacks" });
  }
});
app.post("/api/feedback", async (req, res) => {
  try {
    const { feedback, rating } = req.body;
    console.log("📥 Received feedback data:", { feedback, rating });

    if (!feedback || typeof rating !== 'number' || rating < 1 || rating > 5) {
      console.warn("⚠️ Invalid feedback data received");
      return res.status(400).json({ error: "Invalid feedback data" });
    }

    const newFeedback = new Feedback({ feedback, rating });
    const savedFeedback = await newFeedback.save();
    console.log("✅ Feedback saved to DB:", savedFeedback);

    res.status(201).json(savedFeedback);
  } catch (error) {
    console.error("❌ Error saving feedback:", error);
    res.status(500).json({ error: "Failed to save feedback" });
  }
});

// Service request routes
app.post("/api/service-requests", async (req, res) => {
  try {
    const { serviceType, location, description } = req.body;
    
    if (!serviceType || !location || !description) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newRequest = new ServiceRequest({ serviceType, location, description });
    const savedRequest = await newRequest.save();
    res.status(201).json(savedRequest);
  } catch (error) {
    console.error("Error saving service request:", error);
    res.status(500).json({ error: "Failed to save service request" });
  }
});

app.get("/api/service-requests", async (req, res) => {
  try {
    const requests = await ServiceRequest.find().sort({ timestamp: -1 });
    res.json(requests);
  } catch (error) {
    console.error("Error fetching service requests:", error);
    res.status(500).json({ error: "Failed to fetch service requests" });
  }
});


// Game score routes
app.post("/api/game/score", async (req, res) => {
  try {
    const { userId, points } = req.body;
    
    if (!userId || typeof points !== 'number' || points <= 0) {
      return res.status(400).json({ error: "Invalid score data" });
    }

    const userScore = await GameScore.findOne({ userId });

    if (userScore) {
      userScore.points += points;
      await userScore.save();
    } else {
      await GameScore.create({ userId, points });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error updating game score:", error);
    res.status(500).json({ error: "Failed to update game score" });
  }
});

app.get("/api/game/leaderboard", async (req, res) => {
  try {
    const scores = await GameScore.find().sort({ points: -1 }).limit(10);
    res.json(scores);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

// Chatbot
app.post("/api/chatbot", (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const responses = [
      "I can help with that. Please check our FAQ section or submit a service request.",
      "Thanks for letting me know. I'll forward this to the facility team.",
      "That's a great question! Here's what I found...",
      "I'm sorry, I didn't understand. Could you rephrase that?",
      "For immediate assistance, please contact our front desk at extension 555.",
    ];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    res.json({ response: randomResponse });
  } catch (error) {
    console.error("Error in chatbot:", error);
    res.status(500).json({ error: "Failed to process chatbot request" });
  }
});

// Basic health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", dbStatus: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = app;