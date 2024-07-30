import React, { useState } from "react";
import { EventBus } from "../game/EventBus";

const SparMenu = ({ buttonDisabled, triggerPhaserEvent }) => {
    const [isHeroTurn, setIsHeroTurn] = useState(true);
    const [isEnemyTurn, setIsEnemyTurn] = useState(false);

    EventBus.on("playerTurn", () => {
        setIsHeroTurn(true);
        setIsEnemyTurn(false);
    });

    EventBus.on("enemyTurn", () => {
        setIsHeroTurn(false);
        setIsEnemyTurn(true);
    });

    return (
        <>
            {isHeroTurn && (
                <div id="hero-options">
                    {/* <p>CHOOSE YOUR ACTION!</p> */}
                    <button
                        disabled={buttonDisabled}
                        onClick={() => triggerPhaserEvent("punch")}
                    >
                        PUNCH: 10SP
                    </button>
                    <button
                        disabled={buttonDisabled}
                        onClick={() => triggerPhaserEvent("kick")}
                    >
                        KICK: 25SP
                    </button>
                    <button
                        disabled={buttonDisabled}
                        onClick={() => triggerPhaserEvent("special")}
                    >
                        SPECIAL: 50SP
                    </button>
                    <button
                        disabled={buttonDisabled}
                        onClick={() => triggerPhaserEvent("guard")}
                    >
                        GUARD & HEAL
                    </button>
                </div>
            )}
            {/* {isEnemyTurn && (
                <div id="enemy-options">
                    <p>Enemy is considering his options...</p>
                    <button disabled>PUNCH</button>
                    <button disabled>KICK</button>
                    <button disabled>SPECIAL</button>
                    <button disabled>GUARD & HEAL</button>
                </div> */}
            {/* )} */}
        </>
    );
};

export default SparMenu;
