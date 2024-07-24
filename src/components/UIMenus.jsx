import React from 'react';
import MainMenu from './MainMenu';
import SparMenu from './SparMenu';
import GameOverMenu from './GameOverMenu';
import LoadingSpinner from './LoadingSpinner';

const UIMenus = ({
  currentScene,
  changeScene,
  triggerPhaserEvent,
  isInitialized,
  isPlayerTurn,
  isEnemyTurn,
  gameIsReady,
}) => {
  return (
    <div id="ui-menus">
      {currentScene === 'MainMenu' && gameIsReady ? (
        <MainMenu changeScene={changeScene} />
      ) : (
        <LoadingSpinner />
      )}
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
