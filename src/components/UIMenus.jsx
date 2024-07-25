import React from "react";
import MainMenu from "./MainMenu";
import SparMenu from "./SparMenu";
import GameOverMenu from "./GameOverMenu";

const UIMenus = ({
    currentScene,
    changeScene,
    buttonDisabled,
    triggerPhaserEvent,
    isInitialized
}) => (
    <div id="ui-menus">
        {/* {currentScene === "MainMenu" && <MainMenu changeScene={changeScene} />} */}
        {currentScene === "Spar" && isInitialized && (
            <SparMenu
                changeScene={changeScene}
                buttonDisabled={buttonDisabled}
                triggerPhaserEvent={triggerPhaserEvent}
            />
        )}
        {currentScene === "GameOver" && (
            <GameOverMenu changeScene={changeScene} />
        )}
    </div>
);

export default UIMenus;
