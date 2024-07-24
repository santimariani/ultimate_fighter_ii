import React from 'react';

const GameOverMenu = ({ changeScene }) => (
  <div id="game-over">
    <button className="button" onClick={changeScene}>
      RESTART
    </button>
  </div>
);

export default GameOverMenu;
