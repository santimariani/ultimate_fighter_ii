import { useRef, useState, useEffect } from "react";
import Phaser from "phaser";
import { PhaserGame } from "./game/PhaserGame";

function App() {
    const [canMoveSprite, setCanMoveSprite] = useState(true);

    const [currentScene, setCurrentScene] = useState("MainMenu");

    const [currentFeedback, setFeedback] = useState(`CHOOSE YOUR NEXT ACTION`);
    const feedbackMessages = [
        "You missed because YOU SUCK!",
        "HA! You SUCK at kicking!",
        "YOU NOT SPECIAL",
        "You guard your head and get punched in the cohones",
    ];

    const phaserRef = useRef();
    const [spritePosition, setSpritePosition] = useState({ x: 0, y: 0 });

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

    const moveSprite = () => {
        const scene = phaserRef.current.scene;
        if (scene && scene.scene.key === "MainMenu") {
            scene.moveLogo(({ x, y }) => {
                setSpritePosition({ x, y });
            });
        }
    };

    const addSprite = () => {
        const scene = phaserRef.current.scene;
        if (scene) {
            // Add more stars
            const x = Phaser.Math.Between(64, scene.scale.width - 64);
            const y = Phaser.Math.Between(64, scene.scale.height - 64);

            // `add.sprite` is a Phaser GameObjectFactory method and it returns a Sprite Game Object instance
            const star = scene.add.sprite(x, y, "star");

            // Create a Phaser Tween to fade the star sprite in and out.
            scene.add.tween({
                targets: star,
                duration: 500 + Math.random() * 1000,
                alpha: 0,
                yoyo: true,
                repeat: 2,
            });
        }
    };

    // Event emitted from the PhaserGame component
    const handleCurrentScene = (scene) => {
        setCanMoveSprite(scene.scene.key !== "MainMenu");
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
                        <p></p>
                        <button
                            disabled={canMoveSprite}
                            className="button"
                            onClick={moveSprite}
                        >
                            ANIMATE LOGO
                            <p>sprite position:</p>
                            <pre>{`x: ${spritePosition.x} y: ${spritePosition.y}\n`}</pre>
                        </button>
                        <div className="spritePosition"></div>
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
                        {/* Add GameOver-specific UI here */}
                        <button className="button" onClick={changeScene}>
                            CHANGE SCENE
                        </button>
                        <p>{currentFeedback}</p>
                        <button className="button" onClick={addSprite}>
                            ADD STAR
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;

