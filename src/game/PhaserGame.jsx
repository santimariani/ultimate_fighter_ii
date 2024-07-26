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

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);


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

    const resetSceneRef = () => {
        EventBus.on('StartingStats', (hero, enemy) => baseCharacterStats(hero, enemy));

        baseCharacterStats = (x, y) => {
            const baseHero = x
            const baseEnemy = y
            return (baseHero, baseEnemy)
        };
        
        // const roundNumber = 1;

        ref.current.scene.fightStateMachine.roundNumber = game.roundNumber;
        ref.current.scene.fightStateMachine.hero = game.baseHero;
        ref.current.scene.fightStateMachine.enemy = gane.baseEnemy;
        ref.current.scene.fightStateMachine.currentState = game.ROUND_STATES.START;

        EventBus.emit("updateUi", game);
    };

    EventBus.on("resetGame", resetSceneRef);

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
            // console.log("currentScene", currentScene);
            if (currentActiveScene instanceof Function) {
                currentActiveScene(currentScene);
            }
            ref.current.scene = currentScene;
        });

        return () => {
            EventBus.removeListener("current-scene-ready");
        };
    }, [currentActiveScene, ref]);

    // console.log(
    //     "current round",
    //     ref.current?.scene?.fightStateMachine?.roundNumber
    // );

    return <div id="game-container"></div>;
});

// Props definitions
PhaserGame.propTypes = {
    currentActiveScene: PropTypes.func,
};

