import { useRef, useState } from "react";
import { PhaserGame } from "./game/PhaserGame";
import { EventBus } from "./game/EventBus";

function App() {
    const [currentScene, setCurrentScene] = useState("MainMenu");
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [currentFeedback, setFeedback] = useState(`CHOOSE YOUR NEXT ACTION`);
    const feedbackMessages = [
        "You missed because YOU SUCK!",
        "HA! You SUCK at kicking!",
        "YOU NOT SPECIAL",
        "You guard your head and get punched in the cohones",
    ];

    const phaserRef = useRef();

    const triggerPhaserEvent = (eventName) => {
        // console.log(`Emitting player action: ${eventName}`);
        EventBus.emit('playerAction', eventName);
        setButtonDisabled(true);
    };

    const changeScene = () => {
        const scene = phaserRef.current?.scene;
        if (scene) {
            scene.changeScene();
        }
    };

    const changeFeedback = (index) => {
        setFeedback(feedbackMessages[index]);
    };

    const switchButton = () => {
        setButtonDisabled(prevState => !prevState);
    };

    // Register EventBus listeners
    EventBus.on("enableInput", switchButton);

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
                            <button className="button" disabled={buttonDisabled} onClick={() => triggerPhaserEvent('punch')}>
                                PUNCH
                            </button>
                            <button className="button" disabled={buttonDisabled} onClick={() => triggerPhaserEvent('kick')}>
                                KICK
                            </button>
                            <button className="button" disabled={buttonDisabled} onClick={() => triggerPhaserEvent('special')}>
                                SPECIAL
                            </button>
                            <button className="button" disabled={buttonDisabled} onClick={() => triggerPhaserEvent('guard')}>
                                GUARD
                            </button>
                        </div>
                        <div id="fight-feedback">
                            <p>{currentFeedback}</p>
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
