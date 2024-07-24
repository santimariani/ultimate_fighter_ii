import React from 'react';
import MainMenu from './MainMenu';
import SparMenu from './SparMenu';
import GameOverMenu from './GameOverMenu';

const UIMenus = ({
  currentScene,
  changeScene,
  triggerPhaserEvent,
  isInitialized,
  isPlayerTurn,
  isEnemyTurn,
}) => {
  console.log('test', currentScene, isInitialized, isPlayerTurn);
  return (
    <div id="ui-menus">
      {currentScene === 'MainMenu' && <MainMenu changeScene={changeScene} />}
      {/* {currentScene === "Spar" && isInitialized && ( */}
      {currentScene === 'Spar' && isInitialized && (
        <SparMenu
          changeScene={changeScene}
          triggerPhaserEvent={triggerPhaserEvent}
          isPlayerTurn={isPlayerTurn}
          isEnemyTurn={isEnemyTurn}
        />
      )}
      {currentScene === 'GameOver' && (
        <GameOverMenu changeScene={changeScene} />
      )}
    </div>
  );
};

export default UIMenus;
