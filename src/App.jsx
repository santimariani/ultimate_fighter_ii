import { useRef, useState, useEffect } from "react";
import Phaser from "phaser";
import { PhaserGame } from "./game/PhaserGame";

function App() {
    const [currentScene, setCurrentScene] = useState("MainMenu");

    const [currentFeedback, setFeedback] = useState(`CHOOSE YOUR NEXT ACTION`);
    const feedbackMessages = [
        "You missed because YOU SUCK!",
        "HA! You SUCK at kicking!",
        "YOU NOT SPECIAL",
        "You guard your head and get punched in the cohones",
    ];

    const phaserRef = useRef();

    const triggerPhaserEvent = (eventName) => {
        const scene = phaserRef.current?.scene;
        if (scene) {
            console.log(`Emitting event: ${eventName}`);
            scene.events.emit(eventName);
        }
    };

    const changeScene = () => {
        const scene = phaserRef.current.scene;
        if (scene) {
            scene.changeScene();
        }
    };

    const changeFeedback = (index) => {
        setFeedback(feedbackMessages[index]);
    };


    const handleCurrentScene = (scene) => {
        setCurrentScene(scene.scene.key); // Update the current scene
    };

    if (window.innerWidth < 480) {
        return (
            <div>
                This game is best enjoyed with a horizontal screen. Please turn
                your phone sideways and refresh {":)"}
            </div>
        );
    }

    return (
        <div id="app">
            <PhaserGame
                ref={phaserRef}
                currentActiveScene={handleCurrentScene}
            />
            <div id="ui-menus">
                {currentScene === "MainMenu" && (
                    <div id="main-menu">
                        <button className="button" onClick={changeScene}>
                            CHANGE SCENE
                        </button>
                    </div>
                )}
                {currentScene === "Spar" && (
                    <>
                        <div id="game">
                            <button className="button" onClick={changeScene}>
                                CHANGE SCENE
                            </button>
                        </div>
                        <div id="fight-options">
                            <button className="button" onClick={() => triggerPhaserEvent('punch')}>
                                PUNCH
                            </button>
                            <button className="button" onClick={() => triggerPhaserEvent('kick')}>
                                KICK
                            </button>
                            <button className="button" onClick={() => triggerPhaserEvent('special')}>
                                SPECIAL
                            </button>
                            <button className="button" onClick={() => triggerPhaserEvent('guard')}>
                                GUARD
                            </button>
                        </div>
                        <div id="fight-feedback">
                            <p>`{currentFeedback}`</p>
                        </div>
                    </>
                )}
                {currentScene === "GameOver" && (
                    <div id="game-over">
                        <button className="button" onClick={changeScene}>
                            CHANGE SCENE
                        </button>

                    </div>
                )}
            </div>
        </div>
    );
}

export default App;

