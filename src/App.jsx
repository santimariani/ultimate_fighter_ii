import React, { useRef, useState } from "react";
import { PhaserGame } from "./game/PhaserGame";
import { EventBus } from "./game/EventBus";
import UIMenus from "../public/components/UIMenus";

function App() {
    const phaserRef = useRef();

    const [currentScene, setCurrentScene] = useState("MainMenu");
    const [buttonDisabled, setButtonDisabled] = useState(true);

    const changeScene = () => {
        const scene = phaserRef.current?.scene;
        if (scene) {
            scene.changeScene();
        }
    };

    const handleCurrentScene = (scene) => {
        setCurrentScene(scene.scene.key);
    };

    const switchButton = () => {
        setButtonDisabled((prevState) => !prevState);
    };

    EventBus.on("enableInput", switchButton);

    const triggerPhaserEvent = (eventName) => {
        EventBus.emit("playerAction", eventName);
        setButtonDisabled(true);
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
            <div id="leftColumn"></div>
            <div id="center">
                <div id="centerCenter">
                    <PhaserGame
                        ref={phaserRef}
                        currentActiveScene={handleCurrentScene}
                    />
                    <UIMenus
                        currentScene={currentScene}
                        changeScene={changeScene}
                        buttonDisabled={buttonDisabled}
                        triggerPhaserEvent={triggerPhaserEvent}
                    />
                </div>
            </div>
            <div id="rightColumn"></div>
        </div>
    );
}

export default App;

