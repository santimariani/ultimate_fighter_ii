import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import { FightRoundsStateMachine } from "../stateMachines/FightRoundsStateMachine";
import CombatActions from "../classes/CombatActions";

export class Spar extends Scene {
    constructor() {
        super("Spar");
        this.initStateVariables();
    }

    initStateVariables() {
        this.fightStateMachine = null;
        this.isInitialized = false;
        this.heroTotalDamageCaused = 0;
        this.heroTotalDamageBlocked = 0;
        this.enemyTotalDamageCaused = 0;
        this.enemyTotalDamageBlocked = 0;
        this.isGamePaused = false;
        this.notificationText = null;
    }

    init(data) {
        this.initCombatants();
        this.initCombatantUpdates();
    }

    initCombatants() {
        this.hero = this.registry.get("hero");
        this.enemy = this.registry.get("enemy");

        this.heroCombatActions = new CombatActions(
            this.hero, 
            this.enemy, 
            this);

        this.enemyCombatActions = new CombatActions(
            this.enemy,
            this.hero,
            this
        );
    }

    initCombatantUpdates() {
        const updateHealth = (character, damage) => (amount) => {
            if (amount < 0) {
                this[damage] += Math.abs(amount);
            }
            character.currentHealth = Math.max(0, Math.min(character.currentHealth + amount, character.totalHealth));
            this.updateBars();
        };

        const updateStamina = (character) => (amount) => {
            character.currentStamina = Math.max(0, Math.min(character.currentStamina + amount, character.totalStamina));
            this.updateBars();
        };

        this.hero.updateHealth = updateHealth(this.hero, "enemyTotalDamageCaused");
        this.enemy.updateHealth = updateHealth(this.enemy, "heroTotalDamageCaused");

        this.hero.updateStamina = updateStamina(this.hero);
        this.enemy.updateStamina = updateStamina(this.enemy);
    }

    create() {
        this.setupSounds();
        this.setupEventListeners();
        this.setupUIElements();

        const notificationStyle = {
            fontFamily: "Arial Black",
            fontSize: "24px",
            fontStyle: "italic",
            color: "#ffffff",
            align: "right",
        };

        this.notificationText = this.add
            .text(
                this.cameras.main.width - 10, 
                this.cameras.main.height - 10, 
                "",
                notificationStyle
            )
            .setOrigin(1, 1) 
            .setVisible(false)
            .setDepth(100); 

        this.updateBars();
        this.showStatsAndRemoveFight();

        EventBus.emit("current-scene-ready", this);
    }

    // Helper method to create a sound instance
    initSound(name, volume = 1, loop = false) {
        return this.sound.add(name, { loop, volume });
    }

    // Setup all sounds
    setupSounds() {
        this.sparIntro = this.initSound("sparIntro", 0.5);
        this.sparLoop = this.initSound("sparLoop", 0.5, true);
        
        // Punch sounds
        this.punchSounds = Array(9)
            .fill()
            .map((_, i) => this.initSound(`punch${i + 1}`, 0.5));

        // Kick sounds
        this.kickSounds = Array(9)
            .fill()
            .map((_, i) => this.initSound(`kick${i + 1}`, 0.5));

        this.massivePunch = this.initSound("massivePunch", 1);
        this.massiveKick = this.initSound("massiveKick", 1);
        this.special = this.initSound("special", 1.5);
    }

    // Setup all event listeners
    setupEventListeners() {
        EventBus.on("gameStateSaved", () => this.showNotification("GAME STATE SAVED"));
        EventBus.on("gameStateLoaded", () => this.showNotification("GAME STATE LOADED"));
        EventBus.on("muteGame", this.muteGame, this);
        EventBus.on("pauseGame", this.pauseGame, this);
        EventBus.on("resumeGame", this.resumeGame, this);

        this.events.on("punch", this.heroCombatActions.punch.bind(this.heroCombatActions));
        this.events.on("kick", this.heroCombatActions.kick.bind(this.heroCombatActions));
        this.events.on("special", this.heroCombatActions.special.bind(this.heroCombatActions));
        this.events.on("guard", this.heroCombatActions.guard.bind(this.heroCombatActions));

        this.events.on("enemyGo", this.enemyAction, this);
        this.events.on("fightEnded", this.changePostFightScene, this);
    }

    // Helper to create UI bars
    createStatusBar(x, y, color, label) {
        const bar = this.add.graphics().setVisible(false);
        const labelText = this.add.text(x, y, label, { fontSize: "32px", fill: "#fff" }).setVisible(false);
        return { bar, labelText };
    }

    // Setup UI elements (health/stamina bars, text)
    setupUIElements() {
        this.heroBars = {
            health: this.createStatusBar(16, 16, 0x00ff00, "HEALTH"),
            stamina: this.createStatusBar(16, 80, 0x4da6ff, "STAMINA"),
        };

        this.enemyBars = {
            health: this.createStatusBar(550, 16, 0xff0000, "HEALTH"),
            stamina: this.createStatusBar(550, 80, 0x4da6ff, "STAMINA"),
        };
    }

    // General method to update a bar
    updateBar(bar, current, total, x, y, width, height, color) {
        const percentage = current / total;
        bar.clear();
        bar.fillStyle(0x000000, 0.9); // Background
        bar.fillRect(x, y, width, height);
        bar.fillStyle(color);
        bar.fillRect(x, y, width * percentage, height);
    }

    // Update all bars (hero and enemy)
    updateBars() {
        this.updateBar(this.heroBars.health.bar, this.hero.currentHealth, this.hero.totalHealth, 16, 16, 375, 30, 0x00ff00);
        this.updateBar(this.heroBars.stamina.bar, this.hero.currentStamina, this.hero.totalStamina, 16, 80, 375, 30, 0x4da6ff);

        this.updateBar(this.enemyBars.health.bar, this.enemy.currentHealth, this.enemy.totalHealth, 550, 16, 375, 30, 0xff0000);
        this.updateBar(this.enemyBars.stamina.bar, this.enemy.currentStamina, this.enemy.totalStamina, 550, 80, 375, 30, 0x4da6ff);
    }

    updatePopupText(text) {
        this.popupText.setText(text);
        this.popupBackground.setVisible(true);
        this.popupText.setVisible(true);
    }

    hidePopupText() {
        this.popupBackground.setVisible(false);
        this.popupText.setVisible(false);
    }

    muteGame() {
        this.sound.mute = !this.sound.mute;
    }

    pauseGame() {
        this.scene.pause();
        this.sparIntro.pause();
        this.sparLoop.pause();
        this.isGamePaused = true;
        this.pauseBackground.setVisible(true);
        this.pauseText.setVisible(true);
    }

    resumeGame() {
        this.scene.resume();
        this.sparIntro.resume();
        this.sparLoop.resume();
        this.isGamePaused = false;
        this.pauseBackground.setVisible(false);
        this.pauseText.setVisible(false);
    }

    showNotification(message) {
        console.log("Displaying notification:", message);
        this.notificationText.setText(message);
        this.notificationText.setVisible(true);

        this.time.delayedCall(3000, () => {
            this.notificationText.setVisible(false);
        });
    }

    showStatsAndRemoveFight() {
        this.heroBars.health.bar.setVisible(true);
        this.heroBars.stamina.bar.setVisible(true);
        this.enemyBars.health.bar.setVisible(true);
        this.enemyBars.stamina.bar.setVisible(true);

        this.fightStateMachine = new FightRoundsStateMachine(this);
        this.fightStateMachine.start();

        this.isInitialized = true;
        EventBus.emit("fightStateMachineInitialized");
    }

    update() {
        if (this.isInitialized) {
            this.fightStateMachine.update();
        }
        this.updateTextElements();
    }

    updateTextElements() {
        // Update logic for text elements (if necessary)
    }

    heroAction(action) {
        switch (action) {
            case "punch":
                this.heroCombatActions.punch(() => {
                    this.enemyTotalDamageBlocked += this.enemy.damageBlocked;
                    this.events.emit("heroActionComplete");
                });
                break;
            case "kick":
                this.heroCombatActions.kick(() => {
                    this.enemyTotalDamageBlocked += this.enemy.damageBlocked;
                    this.events.emit("heroActionComplete");
                });
                break;
            case "special":
                this.heroCombatActions.special(() => {
                    this.enemyTotalDamageBlocked += this.enemy.damageBlocked;
                    this.events.emit("heroActionComplete");
                });
                break;
            case "guard":
                this.heroCombatActions.guard(() => {
                    this.enemyTotalDamageBlocked += this.enemy.damageBlocked;
                    this.events.emit("heroActionComplete");
                });
                break;
            default:
                console.log("Unknown action:", action);
        }
    }

    enemyAction() {
        this.updatePopupText(`${this.enemy.name} considers \nhis options ...`);
        EventBus.emit("enemyTurn");
        setTimeout(() => {
            const actions = ["punch", "kick", "special", "guard"];
            let action;

            do {
                action = actions[Math.floor(Math.random() * actions.length)];
            } while (
                (action === "punch" &&
                    this.enemy.currentStamina <
                        this.enemyCombatActions.attackTypes.punch
                            .requiredStamina) ||
                (action === "kick" &&
                    this.enemy.currentStamina <
                        this.enemyCombatActions.attackTypes.kick
                            .requiredStamina) ||
                (action === "special" &&
                    this.enemy.currentStamina <
                        this.enemyCombatActions.attackTypes.special
                            .requiredStamina) || 
                (action === "guard" &&
                    !(
                        this.enemy.currentHealth <
                            this.enemy.totalHealth * 0.5 ||
                        this.enemy.currentStamina <
                            this.enemy.totalStamina * 0.5
                    ))
            );

            const onComplete = () => {
                this.heroTotalDamageBlocked += this.hero.damageBlocked;
                this.events.emit("enemyActionComplete");
            };

            switch (action) {
                case "punch":
                    this.enemyCombatActions.punch(onComplete);
                    break;
                case "kick":
                    this.enemyCombatActions.kick(onComplete);
                    break;
                case "special":
                    this.enemyCombatActions.special(onComplete);
                    break;
                case "guard":
                    this.enemyCombatActions.guard(onComplete);
                    break;
                default:
                    console.log("Unknown action:", action);
            }
        }, 2000);
    }

    changePostFightScene({ roundOut, knockOut }) {
        this.scene.stop();
        this.scene.start("PostFight", {
            heroTotalDamageCaused: this.heroTotalDamageCaused,
            heroTotalDamageBlocked: this.heroTotalDamageBlocked,
            enemyTotalDamageCaused: this.enemyTotalDamageCaused,
            enemyTotalDamageBlocked: this.enemyTotalDamageBlocked,
            roundOut: this.fightStateMachine,
            knockOut: this.fightStateMachine.knockOut,
        });
    }
}
