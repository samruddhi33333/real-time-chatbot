import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./Chats.css";

const socket = io("http://localhost:5000");

function Chats({ username }) {
  const [users, setUsers] = useState({});
  const [currentChatUser, setCurrentChatUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (username) {
      socket.emit("addUser", username);
    }

    socket.on("updateUserList", (userList) => {
      setUsers(userList);
    });

    socket.on("receiveMessage", ({ sender, message }) => {
      setMessages((prev) => [...prev, { sender, message }]);
    });

    return () => {
      socket.off("updateUserList");
      socket.off("receiveMessage");
    };
  }, [username]);

  const sendMessage = () => {
    if (message.trim() !== "" && currentChatUser) {
      const recipientId = Object.keys(users).find(
        (key) => users[key] === currentChatUser
      );

      socket.emit("sendMessage", {
        sender: username,
        recipientId,
        message,
      });

      setMessages((prev) => [...prev, { sender: "You", message }]);
      setMessage("");
    }
  };

  return (
    <div className="chats-container">
      <h2>Welcome, {username}!</h2>

      <div className="active-users">
        <h3>Active Users:</h3>
        <ul>
          {Object.values(users)
            .filter((user) => user !== username)
            .map((user, index) => (
              <li key={index} onClick={() => setCurrentChatUser(user)}>
                {user}
              </li>
            ))}
        </ul>
      </div>

      {currentChatUser && (
        <>
          <div className="chatbox">
            <div className="messages">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message ${msg.sender === "You" ? "you" : ""}`}
                >
                  <p>
                    <strong>{msg.sender}:</strong> {msg.message}
                  </p>
                </div>
              ))}
            </div>
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Chats;
