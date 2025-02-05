import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:5000");

function App() {
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentChatUser, setCurrentChatUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [groupMembers, setGroupMembers] = useState([]);

  useEffect(() => {
    socket.on("updateUserList", (userList) => {
      setUsers(userList);
    });

    socket.on("receiveMessage", ({ sender, message, group }) => {
      setMessages((prev) => [...prev, { sender, message, group }]);
    });

    socket.on("groupError", (error) => {
      alert(error);
    });

    socket.on("joinGroup", (groupName) => {
      alert(`You have joined the group: ${groupName}`);
    });

    return () => {
      socket.off("updateUserList");
      socket.off("receiveMessage");
      socket.off("groupError");
      socket.off("joinGroup");
    };
  }, []);

  const handleLogin = () => {
    if (username.trim() !== "") {
      socket.emit("addUser", username);
      setLoggedIn(true);
    }
  };

  const sendMessage = () => {
    if (message.trim() !== "") {
      const recipientId = Object.keys(users).find(
        (key) => users[key] === currentChatUser
      );
      socket.emit("sendMessage", {
        sender: username,
        recipientId: recipientId || null,
        message,
        group: currentChatUser || null,
      });
      setMessages((prev) => [...prev, { sender: "You", message }]);
      setMessage(""); 
    }
  };

  const createGroup = () => {
    if (groupName.trim() === "" || groupMembers.length === 0) {
      alert("Please enter a group name and select members.");
      return;
    }
    socket.emit("createGroup", { groupName, members: groupMembers });
  };

  return (
    <div className="app-container">
      <div className="header">
        <div className="user-info">
          <h2>{username || "Guest"}</h2>
          <span>Online</span>
        </div>
      </div>

      {!loggedIn ? (
        <div className="login">
          <input
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={handleLogin}>Join Chat</button>
        </div>
      ) : (
        <>
          <div className="active-users">
            <h3>Active Users:</h3>
            <ul>
              {Object.values(users)
                .filter((user) => user !== username)
                .map((user, index) => (
                  <li
                    key={index}
                    onClick={() => setCurrentChatUser(user)}
                  >
                    {user}
                  </li>
                ))}
            </ul>
          </div>
          

          {/* Group Creation Section */}
          <div className="group-creation">
            <h3>Create a Group</h3>
            <input
              type="text"
              placeholder="Enter group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
            <select
              multiple
              value={groupMembers}
              onChange={(e) =>
                setGroupMembers(
                  Array.from(e.target.selectedOptions, (option) => option.value)
                )
              }
            >
              {Object.values(users)
                .filter((user) => user !== username)
                .map((user, index) => (
                  <option key={index} value={user}>
                    {user}
                  </option>
                ))}
            </select>
            <button onClick={createGroup}>Create Group</button>
          </div>



          


          {/* Messages Section */}
          {currentChatUser && (
            <>
              <div className="chatbox">
                <h3>Chat with: {currentChatUser}</h3>
                <div className="messages">
                  {messages
                    .filter((msg) => msg.group === currentChatUser || !msg.group)
                    .map((msg, index) => (
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
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;
