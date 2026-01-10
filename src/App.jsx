import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import Messages from "./messages.jsx";

const socket = io("http://172.30.80.79:3001");

function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on("initialMessages", (msgs) => {
      setMessages(msgs);
    });

    socket.on("newMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("initialMessages");
      socket.off("newMessage");
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleLogin() {
    if (username.trim() !== "") {
      setIsLoggedIn(true);
    }
  }

  function AddMessage() {
    if (inputValue.trim() !== "") {
      const messageData = { user: username, text: inputValue.trim() };
      socket.emit("sendMessage", messageData);
      setInputValue("");
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') AddMessage();
  }

  // --- Οθόνη Εισόδου (Login) ---
  if (!isLoggedIn) {
    return (
      <div className="app-container">
        <div className="login-card">
          <h2>👤 Είσοδος στο Chat</h2>
          <input 
            type="text" 
            placeholder="Πώς σε λένε;" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={handleLogin}>Μπες στο Chat</button>
        </div>
      </div>
    );
  }

  // --- Κυρίως Chat ---
  return (
    <div className="app-container">
      <div className="chat-window">
        
        <div className="chat-header">
          <h2>💬 Global Chat</h2>
          <div className="user-info">
            <span className="status-dot">Online</span>
            <span className="my-name">({username})</span>
          </div>
        </div>

        <div className="messages-list">
          <ul>
            {messages.map((msg, index) => (
              <Messages key={index} data={msg} currentUser={username} />
            ))}
            <div ref={messagesEndRef} />
          </ul>
        </div>

        <div className="chat-input-area">
          <input
            type="text"
            value={inputValue}
            placeholder="Γράψε μήνυμα..."
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button onClick={AddMessage}>Send</button>
        </div>

      </div>
    </div>
  );
}

export default App;