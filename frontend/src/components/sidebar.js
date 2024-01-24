import React from 'react';
import { useState } from "react";
import '../../static/frontend/mystyle.css';


const Sidebar = () => {
  const [open, setOpen] = useState(true);

  return (
    <div className='sidebar'>
    <div id="nav-bar">
      <div id="nav-content">
          <div className="nav-button1"><i className="fas fa-palette"></i><span>Your Work</span></div>
          <div className="nav-button1"><i className="fas fa-images"></i><span>Assets</span></div>
          <div className="nav-button1"><i className="fas fa-thumbtack"></i><span>Pinned Items</span></div>
          <hr/>
          <div className="nav-button1"><i className="fas fa-heart"></i><span>Following</span></div>
          <div className="nav-button1"><i className="fas fa-chart-line"></i><span>Trending</span></div>
          <div className="nav-button1"><i className="fas fa-fire"></i><span>Challenges</span></div>
          <div className="nav-button1"><i className="fas fa-magic"></i><span>Spark</span></div>
          <hr/>
          <div className="nav-button1"><i className="fas fa-gem"></i><span>Codepen Pro</span></div>
          {/* <div className="nav-content-highlight"></div> */}
      </div><input id="nav-footer-toggle" type="checkbox" />
  </div>
</div>
  );
};

export default Sidebar;