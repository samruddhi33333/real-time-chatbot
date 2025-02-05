import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './Chatbot.css';

const socket = io('http://localhost:5000'); 
function Chatbot({ username }) {
  const [currentChatGroup, setCurrentChatGroup] = useState([]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState({});
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
   
    if (username) {
      socket.emit('addUser', username);
    }

    socket.on('updateUserList', (userList) => {
      setUsers(userList);
    });

    socket.on('receiveMessage', ({ sender, message, group }) => {
      if (group && currentChatGroup.includes(sender)) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender, message, group },
        ]);
      }
    });

    return () => {
      socket.off('updateUserList');
      socket.off('receiveMessage');
    };
  }, [username, currentChatGroup]);

  const sendMessage = () => {
    if (message.trim() !== '' && currentChatGroup.length > 0) {
      socket.emit('sendMessage', {
        sender: username,
        group: currentChatGroup,
        message,
      });

      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'You', message, group: currentChatGroup },
      ]);
      setMessage('');
    }
  };

  const handleUserSelect = (user) => {
    if (selectedUsers.includes(user)) {
      setSelectedUsers(selectedUsers.filter((u) => u !== user));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const createGroup = () => {
    if (selectedUsers.length > 0) {
      setCurrentChatGroup(selectedUsers);
      setMessages([]);
      setSelectedUsers([]);
    }
  };

  return (
    <div className="chatbot-container">
      <h2>Welcome to the Chat, {username}!</h2>

      <div className="active-users">
        <h3>Active Users:</h3>
        <ul>
          {Object.values(users)
            .filter((user) => user !== username)
            .map((user, index) => (
              <li key={index} onClick={() => handleUserSelect(user)}>
                {user}
              </li>
            ))}
        </ul>
      </div>

      {selectedUsers.length > 0 && (
        <div className="selected-users">
          <h4>Selected Users for Group:</h4>
          <ul>
            {selectedUsers.map((user, index) => (
              <li key={index}>{user}</li>
            ))}
          </ul>
          <button onClick={createGroup}>Create Group</button>
        </div>
      )}

      {currentChatGroup.length > 0 && (
        <div className="chatbox">
          <h3>Group Chat</h3>
          <div className="messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender === 'You' ? 'you' : ''}`}>
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
      )}
    </div>
  );
}

export default Chatbot;
