import React from "react";
import MainMenu from "./MainMenu";
import SparMenu from "./SparMenu";
import GameOverMenu from "./GameOverMenu";

const UIMenus = ({
    currentScene,
    changeScene,
    buttonDisabled,
    triggerPhaserEvent
}) => (
    <div id="ui-menus">
        {currentScene === "MainMenu" && <MainMenu changeScene={changeScene} />}
        {currentScene === "Spar" && (
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
