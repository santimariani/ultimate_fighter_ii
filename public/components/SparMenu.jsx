import React, { useState } from "react";

const SparMenu = ({ changeScene, buttonDisabled, triggerPhaserEvent }) => {
    const [currentFeedback, setFeedback] = useState(`CHOOSE YOUR NEXT ACTION`);
    const feedbackMessages = [
        "You missed because YOU SUCK!",
        "HA! You SUCK at kicking!",
        "YOU NOT SPECIAL",
        "You guard your head and get punched in the cohones",
    ];

    const changeFeedback = (index) => {
        setFeedback(feedbackMessages[index]);
    };

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
