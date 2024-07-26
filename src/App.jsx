import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createClient } from "@supabase/supabase-js";
import React, { useEffect, useRef, useState } from "react";
import UIMenus from "./components/UIMenus";
import { EventBus } from "./game/EventBus";
import { PhaserGame } from "./game/PhaserGame";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);
//     "https://kqzjchdvriyxuaxybphk.supabase.co",
//     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxempjaGR2cml5eHVheHlicGhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE0MDQ0ODgsImV4cCI6MjAzNjk4MDQ4OH0.dTf4QKwAwFjSxvk2D_a3yuk-gFjgiH8sOLRt7HHGZv0"
// );

// const supabase = import.meta.env.VITE_SUPABASE_ANON_KEY;

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
    const [isGamePaused, setIsGamePaused] = useState(false); // State to manage pause/resume
    const [isGameMuted, setIsGameMuted] = useState(false); // State to manage pause/resume
    const sceneChangeCooldown = 500; // 500 ms cooldown

    const [isInitialized, setIsInitialized] = useState(false);

    EventBus.on("fightStateMachineInitialized", () => {
        setIsInitialized(true);
    });

    const handleRefresh = () => {
        window.location.reload();
        setIsGamePaused(false);
        setIsGameMuted(false);
    };

    const toggleSound = () => {
        EventBus.emit("muteGame");
        setIsGameMuted(!isGameMuted);
    };

    const togglePauseResume = () => {
        if (isGamePaused) {
            EventBus.emit("resumeGame");
        } else {
            EventBus.emit("pauseGame");
        }
        setIsGamePaused(!isGamePaused);
        setButtonDisabled(!buttonDisabled);
    };

    async function getScores() {
        const { data } = await supabase.from("score").select();
        // console.log("data", data);
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
        // console.log("Game save!", data, phaserRef.current?.scene);
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

    EventBus.on("enablePlayerButtons", switchButton);

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
        // console.log("subscription", subscription);
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

    const handleBackButton = () => {
        EventBus.emit("goToPreviousScene");
    };

    const handleNextButton = () => {
        EventBus.emit("goToNextScene");
    };

    // console.log("GAME STATE", gameState, phaserRef.current);
    return (
        <div id="app">
            {/* Left Column */}
            <div id="leftColumn">
                <div
                    id="leftShoulderButton"
                    onClick={handleBackButton}
                    style={{ cursor: "pointer" }}
                >
                    <p className="fowardItalics">BACK</p>
                </div>
                <div id="outerCircleLeft">
                    <button
                        onClick={() => {
                            setShowLogin(true);
                            setShowRegister(false);
                        }}
                        id="innerCircleLeft"
                        style={{ cursor: "pointer" }}
                    ></button>
                </div>
                <p
                    id="leftStickText"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowLogin(true)}
                >
                    SIGN IN
                </p>
                <div id="outerKeyPad">
                    <button
                        onClick={() => {
                            setShowRegister(true);
                            setShowLogin(false);
                        }}
                        id="innerKeyPad"
                        style={{ cursor: "pointer" }}
                    ></button>
                </div>
                <p
                    id="keyPadText"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowRegister(true)}
                >
                    NEW USER
                </p>
                <div id="leftShoulderHole"></div>
                <button
                    type="button"
                    onClick={toggleSound}
                    id="sound"
                    style={{ cursor: "pointer" }}
                >
                    {isGameMuted ? "SOUND" : "MUTE"}
                </button>
                <button
                    type="button"
                    onClick={togglePauseResume}
                    id="pause"
                    style={{ cursor: "pointer" }}
                >
                    {isGamePaused ? "RESUME" : "PAUSE"}
                </button>
            </div>

            {/* Center Column */}
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
                        <div className="center-content">
                            {!showRegister && !showLogin && (
                                <div>
                                    <p className="welcome-text">WELCOME!</p>
                                    <p className="info-text">
                                        CREATE NEW USER OR <br /> SIGN IN TO
                                        PLAY THE GAME!
                                    </p>
                                </div>
                            )}
                            {showRegister && (
                                <div className="auth-container">
                                    <p className="info-text">
                                        CREATE A NEW ACCOUNT <br /> TO PLAY THE GAME!
                                    </p>
                                    <Auth
                                        view="sign_up"
                                        supabaseClient={supabase}
                                        appearance={{ theme: ThemeSupa }}
                                        theme="dark"
                                        providers={[]}
                                    />
                                </div>
                            )}
                            {showLogin && (
                                <div className="auth-container">
                                    <p className="info-text">
                                        SIGN IN TO YOUR ACCOUNT <br /> TO PLAY THE GAME!
                                    </p>
                                    <Auth
                                        supabaseClient={supabase}
                                        appearance={{ theme: ThemeSupa }}
                                        theme="dark"
                                        providers={[]}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Column */}
            <div id="rightColumn">
                <div
                    id="rightShoulderButton"
                    onClick={handleNextButton}
                    style={{ cursor: "pointer" }}
                >
                    <p className="backwardItalics">NEXT</p>
                </div>
                <div id="outerCircleRight">
                    <button
                        id="innerCircleRight"
                        onClick={logOut}
                        style={{ cursor: "pointer" }}
                    ></button>
                </div>
                <p
                    id="rightStickText"
                    style={{ cursor: "pointer" }}
                    onClick={logOut}
                >
                    SIGN OUT
                </p>
                <div id="fourButtons">
                    <button
                        type="button"
                        onClick={handleRefresh}
                        id="square1"
                        style={{ cursor: "pointer" }}
                    >
                        <p className="buttonText">R</p>
                    </button>
                    <button
                        type="button"
                        onClick={loadGameState}
                        id="square2"
                        style={{ cursor: "pointer" }}
                    >
                        <p className="buttonText">L</p>
                    </button>
                    <button
                        type="button"
                        onClick={saveGameState}
                        id="square3"
                        style={{ cursor: "pointer" }}
                    >
                        <p className="buttonText">S</p>
                    </button>
                    <button
                        type="button"
                        onClick={togglePauseResume}
                        id="square4"
                        style={{ cursor: "pointer" }}
                    >
                        <p className="buttonText">P</p>
                    </button>
                </div>
                <div id="gridContainerRight">
                    <div
                        className="gridItemRight"
                        style={{ gridArea: "2 / 2", cursor: "pointer" }}
                        onClick={handleRefresh}
                    ></div>
                    <div
                        className="gridItemRight"
                        style={{ gridArea: "4 / 2", cursor: "pointer" }}
                        onClick={saveGameState}
                    ></div>
                    <div
                        className="gridItemRight"
                        style={{ gridArea: "6 / 2", cursor: "pointer" }}
                        onClick={loadGameState}
                    ></div>
                    <div
                        className="gridItemRight"
                        style={{ gridArea: "8 / 2", cursor: "pointer" }}
                        onClick={togglePauseResume}
                    ></div>
                    <div
                        className="gridTextRight"
                        style={{ gridArea: "2 / 4", cursor: "pointer" }}
                        onClick={handleRefresh}
                    >
                        REFRESH
                    </div>
                    <div
                        className="gridTextRight"
                        style={{ gridArea: "4 / 4", cursor: "pointer" }}
                        onClick={saveGameState}
                    >
                        SAVE
                    </div>
                    <div
                        className="gridTextRight"
                        style={{ gridArea: "6 / 4", cursor: "pointer" }}
                        onClick={loadGameState}
                    >
                        LOAD
                    </div>
                    <div
                        className="gridTextRight"
                        style={{ gridArea: "8 / 4", cursor: "pointer" }}
                        onClick={togglePauseResume}
                    >
                        PAUSE
                    </div>
                </div>
                <div id="rightShoulderHole"></div>
            </div>
        </div>
    );
}
export default App;

