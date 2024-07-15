import { useRef, useState, useEffect, useLayoutEffect } from "react";
import Phaser, { Scene, Events } from "phaser";
import { PhaserGame } from "./game/PhaserGame";
import { EventBus } from "./game/EventBus";
//import Phaser from "phaser";

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
    console.log("M phaserRef", phaserRef);
    //const refScene = phaserRef.current.scene;

    const triggerPhaserEvent = (x) => {
        // Maybe here use EventBus to emit x

        console.log("triggerPhaserEvent", x);
        console.log("phaserRef.current.scene", phaserRef.current);
        if (phaserRef.current) {
            console.log(`Emitting event: ${x}`);
            //phaserRef.current.scene.events.emit(x);
            console.log(">>>>> DISABLE AND EMIT ACTION");
            setButtonsDisabled(true);
            EventBus.emit(x, phaserRef.current.scene.events.emit(x));
        }
    };

    const changeScene = (x) => {
        console.log("M changeScene refScene", phaserRef);
        if (x.current.scene) {
            x.current.scene.changeScene();
        }
    };

    const handleCurrentScene = (refScene) => {
        setCurrentScene(refScene.scene.key);
        if (refScene.scene.key === "Spar") {
            setButtonsDisabled(false);
        } else {
            setButtonsDisabled(true);
        }
    };

    if (window.innerWidth < 480) {
        return (
            <div>
                This game is best enjoyed with a horizontal screen. Please turn
                your phone sideways and refresh {":)"}
            </div>
        );
    }

    console.log("M pre useEffect phaserRef", phaserRef);

    useEffect(() => {
        console.log("UE phaserRef.current?.scene", phaserRef.current?.scene);
        if (phaserRef.current?.scene) {
            const useEffectScene = phaserRef.current?.scene;

            const setupEventListeners = () => {
                if (useEffectScene) {
                    useEffectScene.events.on(
                        "enablePlayerInput",
                        handleEnablePlayerInput
                    );
                    useEffectScene.events.on(
                        "heroActionComplete",
                        handleHeroActionComplete
                    );
                    useEffectScene.events.on(
                        "enemyActionComplete",
                        handleEnemyActionComplete
                    );
                }
            };

            const handleEnablePlayerInput = () => {
                setButtonsDisabled(false);
                console.log("UE Player input enabled");
            };

            const handleHeroActionComplete = () => {
                console.log(
                    "UE Hero action complete, waiting for enemy action"
                );
                if (useEffectScene) {
                    setButtonsDisabled(true);
                    useEffectScene.events.emit("enemyAction");
                }
            };

            const handleEnemyActionComplete = () => {
                console.log("UE Enemy action complete, enabling player input");
                if (useEffectScene) {
                    setButtonsDisabled(false);
                    useEffectScene.events.emit("enablePlayerInput");
                }
            };

            setupEventListeners();

            return () => {
                console.log("UE return");
                if (useEffectScene) {
                    console.log("UE return if");
                    useEffectScene.events.off(
                        "enablePlayerInput",
                        handleEnablePlayerInput
                    );
                    useEffectScene.events.off(
                        "heroActionComplete",
                        handleHeroActionComplete
                    );
                    useEffectScene.events.off(
                        "enemyActionComplete",
                        handleEnemyActionComplete
                    );
                }
            };
        }
    }, [phaserRef.current?.scene]);

    // We have to use EventBus to emit and listen
    EventBus.on("kick", (data) => {
        console.log("!!!>>>>>", data);
        if (data) {
            console.log(">>>>> ENABLE ACTIONS");
            setButtonsDisabled(false);
        }
    });

    console.log("after UE phaserRef", phaserRef);
    return (
        <div id="app">
            <PhaserGame
                ref={phaserRef}
                currentActiveScene={handleCurrentScene}
            />
            <div id="ui-menus">
                {currentScene === "MainMenu" && (
                    <div id="main-menu">
                        <button
                            className="button"
                            onClick={() => changeScene(phaserRef)}
                        >
                            CHANGE SCENE
                        </button>
                    </div>
                )}
                {currentScene === "Spar" && (
                    <>
                        <div id="game">
                            <button
                                className="button"
                                onClick={() => changeScene(phaserRef)}
                            >
                                CHANGE SCENE
                            </button>
                        </div>
                        <div id="fight-options">
                            <button
                                className="button"
                                disabled={buttonsDisabled}
                                onClick={() => triggerPhaserEvent("punch")}
                            >
                                PUNCH
                            </button>
                            <button
                                className="button"
                                disabled={buttonsDisabled}
                                onClick={() => triggerPhaserEvent("kick")}
                            >
                                KICK
                            </button>
                            <button
                                className="button"
                                disabled={buttonsDisabled}
                                onClick={() => triggerPhaserEvent("special")}
                            >
                                SPECIAL
                            </button>
                            <button
                                className="button"
                                disabled={buttonsDisabled}
                                onClick={() => triggerPhaserEvent("guard")}
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

