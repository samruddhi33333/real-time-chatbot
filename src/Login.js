import React, { useState } from "react";
import "./Login.css";

function Login({ setUsername }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (name.trim() !== "") {
      localStorage.setItem("username", name);
      setUsername(name);
    } else {
      setError("Please enter a valid name.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin(); // Trigger login on Enter key
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyPress={handleKeyPress} // Handle Enter key press
      />
      {error && <p className="error-message">{error}</p>} {/* Display error message if name is invalid */}
      <button onClick={handleLogin}>Join Chat</button>
    </div>
  );
}

export default Login;
