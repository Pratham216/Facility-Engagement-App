import React, { useState } from "react";

function Chatbot() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I'm your facility assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    setMessages([...messages, { sender: "user", text: input }]);

    // Simulate bot response
    setTimeout(() => {
      const responses = [
        "I can help with that. Please check our FAQ section or submit a service request.",
        "Thanks for letting me know. I'll forward this to the facility team.",
        "That's a great question! Here's what I found...",
        "I'm sorry, I didn't understand. Could you rephrase that?",
        "For immediate assistance, please contact our front desk at extension 555.",
      ];
      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];
      setMessages((prev) => [...prev, { sender: "bot", text: randomResponse }]);
    }, 1000);

    setInput("");
  };

  return (
    <div className="chatbot">
      <h2>AI Facility Assistant</h2>
      <p>Get instant help with any facility-related questions.</p>

      <div className="chat-window">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Chatbot;