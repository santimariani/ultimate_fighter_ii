import React, { useState } from "react";
import { EventBus } from "../game/EventBus";

/*removed buttonDisabled*/
const SparMenu = ({ triggerPhaserEvent }) => {
    const [currentCharacter, setCurrentCharacter] = useState("hero");

    EventBus.on("heroTurn", () => {
        console.log("heroTurnEmittedFirstAction—received");
        setCurrentCharacter("hero");
    });

    EventBus.on("enemyTurn", () => {
        console.log("enemyTurnEmittedFirstAction—received");
        setCurrentCharacter("enemy");
    });

    return (
        <>
            {currentCharacter === "hero" ? (
                <div id="hero-options">
                    <p>Hero is considering his options... [CHOOSE AN OPTION]</p>
                    <button
                        // disabled={buttonDisabled}
                        onClick={() => triggerPhaserEvent("punch")}
                    >
                        PUNCH—10SP
                    </button>
                    <button
                        // disabled={buttonDisabled}
                        onClick={() => triggerPhaserEvent("kick")}
                    >
                        KICK—25SP
                    </button>
                    <button
                        // disabled={buttonDisabled}
                        onClick={() => triggerPhaserEvent("special")}
                    >
                        SPECIAL—50SP
                    </button>
                    <button
                        // disabled={buttonDisabled}
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