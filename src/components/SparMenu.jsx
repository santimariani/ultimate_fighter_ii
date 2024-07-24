import React, { useState } from 'react';
import { EventBus } from '../game/EventBus';

const SparMenu = ({ triggerPhaserEvent, isEnemyTurn, isPlayerTurn }) => {
  return (
    <>
      {isPlayerTurn && (
        <div id="hero-options">
          <p>Hero is considering his options...</p>
          <button
            disabled={isEnemyTurn}
            onClick={() => triggerPhaserEvent('punch')}
          >
            PUNCH
          </button>
          <button
            disabled={isEnemyTurn}
            onClick={() => triggerPhaserEvent('kick')}
          >
            KICK
          </button>
          <button
            disabled={isEnemyTurn}
            onClick={() => triggerPhaserEvent('special')}
          >
            SPECIAL
          </button>
          <button
            disabled={isEnemyTurn}
            onClick={() => triggerPhaserEvent('guard')}
          >
            GUARD & HEAL
          </button>
        </div>
      )}
      {isEnemyTurn && (
        <div id="enemy-options">
          <p>Enemy is considering his options...</p>
          <button disabled>PUNCH</button>
          <button disabled>KICK</button>
          <button disabled>SPECIAL</button>
          <button disabled>GUARD & HEAL</button>
        </div>
      )}
    </>
  );
};

export default SparMenu;
