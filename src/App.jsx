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
            <div id="leftColumn">
                <div id="leftShoulderButton">
                    <p className="fowardItalics">BACK</p>
                </div>
                <div id="outerCircleLeft">
                    <div id="innerCircleLeft"></div>
                </div>
                <p id="leftStickText">SIGN IN</p>
                <div id="outerKeyPad">
                    <div id="innerKeyPad"></div>
                </div>
                <p id="keyPadText">NEW USER</p>
                <div id="leftShoulderHole"></div>   
                {/* <div id="accountLeft">HOME PAGE</div> */}
                <div id="sound">RELOAD</div>
                <div id="sound">SOUND</div>
                <div id="pause">PAUSE</div>


            </div>
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
            <div id="rightColumn">
                <div id="rightShoulderButton">
                    <p className="backwardItalics">NEXT</p>
                </div>
                <div id="outerCircleRight">
                    <div id="innerCircleRight"></div>
                </div>
                <p id="rightStickText">SIGN OUT</p>
                <div id="fourButtons">
                    <div id="square1">
                        <p className="buttonText">A</p>
                    </div>
                    <div id="square2">
                        <p className="buttonText">L</p>
                    </div>
                    <div id="square3">
                        <p className="buttonText">S</p>
                    </div>
                    <div id="square4">
                        <p className="buttonText">R</p>
                    </div>
                </div>
                <div id="gridContainerRight">
                    <div className="gridItemRight" style={{ gridArea: '2 / 2' }}></div>
                    <div className="gridItemRight" style={{ gridArea: '4 / 2' }}></div>
                    <div className="gridItemRight" style={{ gridArea: '6 / 2' }}></div>
                    <div className="gridItemRight" style={{ gridArea: '8 / 2' }}></div>
                    <div className="gridTextRight" style={{ gridArea: '2 / 4' }}>ACCOUNT</div>
                    <div className="gridTextRight" style={{ gridArea: '4 / 4' }}>SAVE</div>
                    <div className="gridTextRight" style={{ gridArea: '6 / 4' }}>LOAD</div>
                    <div className="gridTextRight" style={{ gridArea: '8 / 4' }}>REFRESH</div>
                </div>
                <div id="rightShoulderHole"></div>
            </div>
        </div>
    );
}

export default App;

