import React, { useState } from "react";
import { EventBus } from "../../src/game/EventBus";

const SparMenu = ({ buttonDisabled, triggerPhaserEvent }) => {
    const [isPlayerTurn, setIsPlayerTurn] = useState(false);

    EventBus.on("playerTurnEnabled", () => {
        setIsPlayerTurn(true);
    });

    EventBus.on("enemyTurn", () => {
        setIsPlayerTurn(false);
    });

    return (
        <>
            {isPlayerTurn ? (
                <div id="hero-options">
                    <p>Hero is considering his options...</p>
                    <button
                        disabled={buttonDisabled}
                        onClick={() => triggerPhaserEvent("punch")}
                    >
                        PUNCH
                    </button>
                    <button
                        disabled={buttonDisabled}
                        onClick={() => triggerPhaserEvent("kick")}
                    >
                        KICK
                    </button>
                    <button
                        disabled={buttonDisabled}
                        onClick={() => triggerPhaserEvent("special")}
                    >
                        SPECIAL
                    </button>
                    <button
                        disabled={buttonDisabled}
                        onClick={() => triggerPhaserEvent("guard")}
                    >
                        GUARD & HEAL
                    </button>
                </div>
            ) : (
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
