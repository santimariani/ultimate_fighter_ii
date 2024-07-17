import React from 'react';

const GameOverMenu = ({ changeScene }) => (
    <div id="game-over">
        <button className="button" onClick={changeScene}>
            CHANGE SCENE
        </button>
    </div>
);

export default GameOverMenu;