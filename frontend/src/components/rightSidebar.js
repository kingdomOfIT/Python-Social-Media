import React from "react";
import { useHistory } from "react-router-dom";

const RightSidebar = ({ sortedUsers }) => {
  const history = useHistory(); 

  const getUserInfo = (userId) => {
    history.push(`/user-info?user_id=${userId}`);
  };

  const pairs = [];
  for (let i = 0; i < sortedUsers.length; i += 2) {
    if (i + 1 < sortedUsers.length) {
      pairs.push([sortedUsers[i], sortedUsers[i + 1]]);
    } else {
      pairs.push([sortedUsers[i]]);
    }
  }

  return pairs.map((pair, index) => (
    <div key={index} className="row">
      {pair.map((user, innerIndex) => {
        const { username, first_name, last_name, profile } = user;
        const profileImage = profile ? profile.image_url : "https://picsum.photos/200";
        const userId = user.id;
        return (
          <div key={innerIndex} className="card-container">
            <img className="round" src={profileImage} alt="user" />
            <h3 
              onClick={() => getUserInfo(userId)} 
              style={{ cursor: "pointer" }}
            >
              {first_name} {last_name}
            </h3>
            <h6>@{username}</h6>
          </div>
        );
      })}
    </div>
  ));
};

export default RightSidebar;
