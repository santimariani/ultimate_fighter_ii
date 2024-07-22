import React, { useState } from "react";
import { EventBus } from "../../src/game/EventBus";

const SparMenu = ({ changeScene, buttonDisabled, triggerPhaserEvent }) => {
    const [isPlayerTurn, setIsPlayerTurn] = useState(false);
    const [currentFeedback, setFeedback] = useState("WAITING FOR OPPONENT");

    EventBus.on("playerTurn", () => {
        setIsPlayerTurn(true);
    });

    EventBus.on("enemyTurn", () => {
        setIsPlayerTurn(false);
        setFeedback("WAITING FOR OPPONENT");
    });

    EventBus.on("feedback", (message) => {
        setFeedback(message);
    });

    return (
        <>
            {isPlayerTurn ? (
                <div id="fight-options">
                    <button
                        className="button"
                        disabled={buttonDisabled}
                        onClick={() => triggerPhaserEvent("punch")}
                    >
                        PUNCH
                    </button>
                    <button
                        className="button"
                        disabled={buttonDisabled}
                        onClick={() => triggerPhaserEvent("kick")}
                    >
                        KICK
                    </button>
                    <button
                        className="button"
                        disabled={buttonDisabled}
                        onClick={() => triggerPhaserEvent("special")}
                    >
                        SPECIAL
                    </button>
                    <button
                        className="button"
                        disabled={buttonDisabled}
                        onClick={() => triggerPhaserEvent("guard")}
                    >
                        GUARD
                    </button>
                </div>
            ) : (
                <div id="fight-feedback">
                    <p>{currentFeedback}</p>
                </div>
            )}
        </>
    );
};

export default SparMenu;
