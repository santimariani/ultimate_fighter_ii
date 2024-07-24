import React from 'react';

const MainMenu = ({ changeScene }) => (
  <div id="main-menu">
    <button className="button" onClick={changeScene}>
      START GAME
    </button>
  </div>
);

export default MainMenu;
