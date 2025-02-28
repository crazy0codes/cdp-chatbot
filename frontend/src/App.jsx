import React, { useState } from "react";
import axios from "axios";

function App() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);

  const askQuestion = async () => {
    try {
      const response = await fetch("http://localhost:3000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });
  
      const data = await response.json(); // Parse JSON response
  
      setMessages([...messages, { user: question, bot: data.answer }]);
      setQuestion("");
    } catch (error) {
      console.error("Error asking question:", error);
      setMessages([...messages, { user: question, bot: "Sorry, an error occurred. Please try again." }]);
    }
  };
  

  return (
    <div>
      <h1>CDP Chatbot</h1>
      <div>
        {messages.map((msg, i) => (
          <div key={i}>
            <strong>You:</strong> {msg.user} <br />
            <strong>Bot:</strong> {msg.bot}
          </div>
        ))}
      </div>
      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a how-to question..."
      />
      <button onClick={askQuestion}>Send</button>
    </div>
  );
}

export default App;