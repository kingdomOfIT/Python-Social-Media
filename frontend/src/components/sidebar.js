import React from 'react';
import { useState } from "react";
import '../../static/frontend/mystyle.css';


const Sidebar = () => {
  const [open, setOpen] = useState(true)

  const handleGiveStarClick = (url) => {
    window.open(url, '_blank');
  };


  return (
    <div className='sidebar'>
    <div id="nav-bar">
      <div id="nav-content">

          <div className="nav-button1"><i className="fas fa-palette"></i><span>My Profile</span></div>
          <div className="nav-button1"><i className="fas fa-thumbtack"></i><span>Saved Posts</span></div>
          <div className="nav-button1"><i className="fas fa-heart"></i><span>Following</span></div>
          <div className="nav-button1"><i className="fas fa-chart-line"></i><span>Trending</span></div>
          <div className="nav-button1"><i className="fas fa-fire"></i><span>Competitons</span></div>
          <hr/>
          <div className="nav-button1" onClick={() => handleGiveStarClick('https://www.buymeacoffee.com/amirkahriman')}><i className="fas fa-gem"></i><span>Writer Pro</span></div>
          <div className='nav-button1' onClick={() => handleGiveStarClick('https://github.com/kingdomOfIT/Python-Social-Media')}><i className='fas fa-star'></i><span>Give a Star</span></div>
          {/* <div className="nav-content-highlight"></div> */}
      </div><input id="nav-footer-toggle" type="checkbox" />
  </div>
</div>
  );
};

export default Sidebar;