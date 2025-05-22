import React, { useState } from "react";
import "./App.css";
import FeedbackForm from "./components/FeedbackForm.jsx";
import ServiceRequest from "./components/ServiceRequest.jsx";
import SustainabilityGame from "./components/SustainabilityGame.jsx";
import Chatbot from "./components/Chatbot.jsx";

function App() {
  const [activeTab, setActiveTab] = useState("feedback");

  return (
    <div className="App">
      <header className="App-header">
        <h1>Engaging Experiences: User-Centric Facility Management</h1>
      </header>

      <nav className="tabs">
        <button
          onClick={() => setActiveTab("feedback")}
          className={activeTab === "feedback" ? "active" : ""}
        >
          Feedback
        </button>
        <button
          onClick={() => setActiveTab("service")}
          className={activeTab === "service" ? "active" : ""}
        >
          Service Request
        </button>
        <button
          onClick={() => setActiveTab("game")}
          className={activeTab === "game" ? "active" : ""}
        >
          Sustainability Game
        </button>
        <button
          onClick={() => setActiveTab("chatbot")}
          className={activeTab === "chatbot" ? "active" : ""}
        >
          AI Chatbot
        </button>
      </nav>

      <main>
        {activeTab === "feedback" && <FeedbackForm />}
        {activeTab === "service" && <ServiceRequest />}
        {activeTab === "game" && <SustainabilityGame />}
        {activeTab === "chatbot" && <Chatbot />}
      </main>
    </div>
  );
}

export default App;