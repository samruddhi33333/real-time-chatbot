import React from "react";

function Chatbox({
  currentChatUser,
  username,
  messages,
  setMessages,
  message,
  setMessage,
}) {
  const sendMessage = () => {
    if (message.trim() !== "") {
      setMessages((prevMessages) => {
        const userMessages = prevMessages[currentChatUser] || [];
        return {
          ...prevMessages,
          [currentChatUser]: [...userMessages, { sender: "You", message }],
        };
      });
      setMessage("");
    }
  };

  return (
    <div className="chatbox">
      <h3>Chat with {currentChatUser}</h3>
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender === "You" ? "you" : ""}`}>
            <p>
              <strong>{msg.sender}:</strong> {msg.message}
            </p>
          </div>
        ))}
      </div>
      <div className="message-input-container">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chatbox;
