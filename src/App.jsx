import { useRef, useState, useEffect } from "react";
import Phaser from "phaser";
import { PhaserGame } from "./game/PhaserGame";

function App() {
    const [currentScene, setCurrentScene] = useState("MainMenu");
    const [buttonsDisabled, setButtonsDisabled] = useState(true);
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
            setButtonsDisabled(true);
        }
    };

    const changeScene = () => {
        const scene = phaserRef.current.scene;
        if (scene) {
            scene.changeScene();
        }
    };

    const handleCurrentScene = (scene) => {
        setCurrentScene(scene.scene.key);
        if (scene.scene.key === "Spar") {
            setButtonsDisabled(false);
        } else {
            setButtonsDisabled(true);
        }
    };

    useEffect(() => {
        const setupEventListeners = () => {
            const scene = phaserRef.current?.scene;
            if (scene) {
                scene.events.on('enablePlayerInput', handleEnablePlayerInput);
                scene.events.on('heroActionComplete', handleHeroActionComplete);
                scene.events.on('enemyActionComplete', handleEnemyActionComplete);
            }
        };

        const handleEnablePlayerInput = () => {
            setButtonsDisabled(false);
            console.log('Player input enabled');
        };

        const handleHeroActionComplete = () => {
            console.log('Hero action complete, waiting for enemy action');
            const scene = phaserRef.current?.scene;
            if (scene) {
                setButtonsDisabled(true);
                scene.events.emit('enemyAction');
            }
        };

        const handleEnemyActionComplete = () => {
            console.log('Enemy action complete, enabling player input');
            const scene = phaserRef.current?.scene;
            if (scene) {
                setButtonsDisabled(false);
                scene.events.emit('enablePlayerInput');
            }
        };

        setupEventListeners();

        return () => {
            const scene = phaserRef.current?.scene;
            if (scene) {
                scene.events.off('enablePlayerInput', handleEnablePlayerInput);
                scene.events.off('heroActionComplete', handleHeroActionComplete);
                scene.events.off('enemyActionComplete', handleEnemyActionComplete);
            }
        };
    }, [phaserRef.current?.scene]);

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
                            <button
                                className="button"
                                disabled={buttonsDisabled}
                                onClick={() => triggerPhaserEvent('punch')}
                            >
                                PUNCH
                            </button>
                            <button
                                className="button"
                                disabled={buttonsDisabled}
                                onClick={() => triggerPhaserEvent('kick')}
                            >
                                KICK
                            </button>
                            <button
                                className="button"
                                disabled={buttonsDisabled}
                                onClick={() => triggerPhaserEvent('special')}
                            >
                                SPECIAL
                            </button>
                            <button
                                className="button"
                                disabled={buttonsDisabled}
                                onClick={() => triggerPhaserEvent('guard')}
                            >
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
