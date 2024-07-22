import PropTypes from "prop-types";
import {
    forwardRef,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import { createClient } from "@supabase/supabase-js";

import StartGame from "./main";
import { EventBus } from "./EventBus";

const supabase = createClient(
    "https://kqzjchdvriyxuaxybphk.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxempjaGR2cml5eHVheHlicGhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE0MDQ0ODgsImV4cCI6MjAzNjk4MDQ4OH0.dTf4QKwAwFjSxvk2D_a3yuk-gFjgiH8sOLRt7HHGZv0"
);

export const PhaserGame = forwardRef(function PhaserGame(
    { currentActiveScene },
    ref
) {
    const [loadedState, setLoadedState] = useState();
    const game = useRef();

    const updateSceneRef = async (x) => {
        console.log("incoming saved state", x);
        console.log("game scene ref", ref.current.scene);

        setLoadedState(x);

        ref.current.scene.fightStateMachine.roundNumber = x.game.roundNumber;
        ref.current.scene.fightStateMachine.hero = x.game.hero;
        ref.current.scene.fightStateMachine.enemy = x.game.enemy;
        ref.current.scene.fightStateMachine.currentState = x.game.currentState;

        EventBus.emit("updateUi", x.game);
    };

    EventBus.on("loadGame", (x) => updateSceneRef(x));

    // Create the game inside a useLayoutEffect hook to avoid the game being created outside the DOM
    useLayoutEffect(() => {
        if (game.current === undefined) {
            game.current = StartGame("game-container");

            if (ref !== null) {
                ref.current = { game: game.current, scene: null };
            }
        }

        return () => {
            if (game.current) {
                game.current.destroy(true);
                game.current = undefined;
            }
        };
    }, [ref]);

    useEffect(() => {
        EventBus.on("current-scene-ready", (currentScene) => {
            console.log("currentScene", currentScene);
            if (currentActiveScene instanceof Function) {
                currentActiveScene(currentScene);
            }
            ref.current.scene = currentScene;
        });

        return () => {
            EventBus.removeListener("current-scene-ready");
        };
    }, [currentActiveScene, ref]);

    console.log(
        "current round",
        ref.current?.scene?.fightStateMachine?.roundNumber
    );

    return <div id="game-container"></div>;
});

// Props definitions
PhaserGame.propTypes = {
    currentActiveScene: PropTypes.func,
};

