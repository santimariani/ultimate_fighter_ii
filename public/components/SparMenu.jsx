import React, { useState } from "react";

const SparMenu = ({ changeScene, buttonDisabled, triggerPhaserEvent }) => {
    const [currentFeedback, setFeedback] = useState(`CHOOSE YOUR NEXT ACTION`);

    return (
        <>
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
            <div id="fight-feedback">
                <p>{currentFeedback}</p>
            </div>
            
        </>
    );
};

export default SparMenu;
