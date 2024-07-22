import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createClient } from "@supabase/supabase-js";
import React, { useEffect, useRef, useState } from "react";
import UIMenus from "../public/components/UIMenus";
import { EventBus } from "./game/EventBus";
import { PhaserGame } from "./game/PhaserGame";


const supabase = createClient(
    "https://kqzjchdvriyxuaxybphk.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxempjaGR2cml5eHVheHlicGhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE0MDQ0ODgsImV4cCI6MjAzNjk4MDQ4OH0.dTf4QKwAwFjSxvk2D_a3yuk-gFjgiH8sOLRt7HHGZv0"
);

const mockState = {
    round: 2,
    step: 3,
    heroStats: {
        name: "santi",
    },
    enemyStats: {
        name: "matu",
    },
};

function App() {
    const phaserRef = useRef();
    const [session, setSession] = useState(null);
    const [currentScene, setCurrentScene] = useState("MainMenu");
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [showRegister, setShowRegister] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [userId, setUserId] = useState("");
    const [scores, setScores] = useState([]);
    const [gameState, setGameState] = useState([]);
    const [isInitialized, setIsInitialized] = useState(false);

    EventBus.on("fightStateMachineInitialized", () => {
        setIsInitialized(true);
    });

    async function getScores() {
        const { data } = await supabase.from("score").select();
        console.log("data", data);
        setScores(data);
    }

    async function getUser() {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        setUserId(user.id);
    }

    async function loadGameState() {
        const { data } = await supabase.from("save_state").select();
        const userSavedStates = data.filter((x) => x.user_id === userId);
        const latestState = { game: userSavedStates.pop().save_state, userId };

        setGameState(latestState);
        // Emit the state via EventBut
        EventBus.emit("loadGame", latestState);
    }

    function resetGame() {
        EventBus.emit("resetGame");
    }

    async function saveGameState() {
        const {
            fightStateMachine: {
                currentState,
                enemy,
                enemyStats,
                hero,
                heroStats,
                maxRounds,
                roundNumber,
            },
        } = phaserRef.current?.scene;

        const { data, error } = await supabase
            .from("save_state")
            .insert({
                save_state: {
                    currentState,
                    enemy,
                    enemyStats,
                    hero,
                    heroStats,
                    maxRounds,
                    roundNumber,
                },
            }) // Key (save_state) is the column, value is the payload, in this case json
            .select();
        console.log("Game save!", data, phaserRef.current?.scene);
    }

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

    const logOut = async () => {
        await supabase.auth.signOut();
        setSession(null);
    };

    useEffect(() => {
        getScores();
        getUser();
    }, []);

    useEffect(() => {
        if (!!userId) {
            //loadGameState();
        }
    }, [userId]);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
        console.log("subscription", subscription);
        return () => subscription.unsubscribe();
    }, []);

    if (window.innerWidth < 480) {
        return (
            <div>
                This game is best enjoyed with a horizontal screen. Please turn
                your phone sideways and refresh {":)"}
            </div>
        );
    }
    console.log("GAME STATE", gameState, phaserRef.current);
    return (
        <div id="app">
            <div id="leftColumn">
                <div id="leftShoulderButton">
                    <p className="fowardItalics">HOME</p>
                </div>
                <div id="outerCircleLeft">
                    <button
                        onClick={() => {
                            setShowLogin(true);
                            setShowRegister(false);
                        }}
                        id="innerCircleLeft"
                    ></button>
                </div>
                <p id="leftStickText">SIGN IN</p>
                <div id="outerKeyPad">
                    <button
                        onClick={() => {
                            setShowRegister(true);
                            setShowLogin(false);
                        }}
                        id="innerKeyPad"
                    ></button>
                </div>
                <p id="keyPadText">NEW USER</p>
                <div id="leftShoulderHole"></div>
                <div id="sound">SOUND</div>
                <button type="button" id="pause">
                    PAUSE
                </button>
            </div>
            <div id="center">
                <div id="centerCenter">
                    {session ? (
                        <>
                            <PhaserGame
                                ref={phaserRef}
                                currentActiveScene={handleCurrentScene}
                            />
                            <UIMenus
                                currentScene={currentScene}
                                changeScene={changeScene}
                                buttonDisabled={buttonDisabled}
                                triggerPhaserEvent={triggerPhaserEvent}
                                isInitialized={isInitialized}
                            />
                        </>
                    ) : (
                        <div style={{ width: "50%", alignItems: "center" }}>
                            {!showRegister && !showLogin && (
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        textAlign: "center",
                                        height: "100vh",
                                        width: "1080px",
                                        fontSize: "8vh",
                                    }}
                                >
                                    <p>WELCOME!</p>
                                    <p>
                                        CREATE NEW USER OR <br></br>SIGN IN TO
                                        PLAY THE GAME!
                                    </p>
                                </div>
                            )}
                            {showRegister && (
                                <Auth
                                    view="sign_up"
                                    supabaseClient={supabase}
                                    appearance={{ theme: ThemeSupa }}
                                    theme="dark"
                                    providers={[]}
                                />
                            )}
                            {showLogin && (
                                <Auth
                                    supabaseClient={supabase}
                                    appearance={{ theme: ThemeSupa }}
                                    theme="dark"
                                    providers={[]}
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>
            <div id="rightColumn">
                <div id="rightShoulderButton">
                    <p className="backwardItalics">GAME</p>
                </div>
                <div id="outerCircleRight">
                    <button id="innerCircleRight" onClick={logOut}></button>
                </div>
                <p id="rightStickText">SIGN OUT</p>
                <div id="fourButtons">
                    <button type="button" onClick={resetGame} id="square1">
                        <p className="buttonText">R</p>
                    </button>
                    <button type="button" onClick={loadGameState} id="square2">
                        <p className="buttonText">L</p>
                    </button>
                    <button type="button" onClick={saveGameState} id="square3">
                        <p className="buttonText">S</p>
                    </button>
                    <div id="square4">
                        <p className="buttonText">A</p>
                    </div>
                </div>
                <div id="gridContainerRight">
                    <div
                        className="gridItemRight"
                        style={{ gridArea: "2 / 2" }}
                    ></div>
                    <div
                        className="gridItemRight"
                        style={{ gridArea: "4 / 2" }}
                    ></div>
                    <div
                        className="gridItemRight"
                        style={{ gridArea: "6 / 2" }}
                    ></div>
                    <div
                        className="gridItemRight"
                        style={{ gridArea: "8 / 2" }}
                    ></div>
                    <div
                        className="gridTextRight"
                        style={{ gridArea: "2 / 4" }}
                    >
                        RESTART
                    </div>
                    <button
                        type="button"
                        onClick={saveGameState}
                        className="gridTextRight"
                        style={{ gridArea: "4 / 4" }}
                    >
                        SAVE
                    </button>
                    <div
                        className="gridTextRight"
                        style={{ gridArea: "6 / 4" }}
                    >
                        LOAD
                    </div>
                    <div
                        className="gridTextRight"
                        style={{ gridArea: "8 / 4" }}
                    >
                        ACCOUNT
                    </div>
                </div>
                <div id="rightShoulderHole"></div>
            </div>
        </div>
    );
}
export default App;

