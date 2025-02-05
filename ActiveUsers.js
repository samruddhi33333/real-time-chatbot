import React from "react";

function ActiveUsers({ users, username, setCurrentChatUser }) {
  return (
    <div className="active-users">
      <h3>Active Users:</h3>
      <ul>
        {Object.values(users)
          .filter((user) => user !== username)
          .map((user, index) => (
            <li key={index} onClick={() => setCurrentChatUser(user)}>
              <img src="images/profile.jpg" alt={user} />
              {user}
            </li>
          ))}
      </ul>
    </div>
  );
}

export default ActiveUsers;
