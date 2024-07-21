import { EventBus } from "../EventBus";
import { Database } from "../../../Database";

export class EventHandlers {
    constructor() {
        this.database = new Database();
        this.fightStateMachine = null;
    }

    init(fightStateMachine) {
        this.fightStateMachine = fightStateMachine;
    }

    saveGame(hero, enemy) {
        const round = this.fightStateMachine.roundNumber;
        const step = this.fightStateMachine.currentState;

        const heroStats = {
            name: hero.name,
            totalHealth: hero.totalHealth,
            currentHealth: hero.currentHealth,
            totalStamina: hero.totalStamina,
            currentStamina: hero.currentStamina,
            strength: hero.strength,
            defense: hero.defense,
            agility: hero.agility,
            reflexes: hero.reflexes,
        };

        const enemyStats = {
            name: enemy.name,
            totalHealth: enemy.totalHealth,
            currentHealth: enemy.currentHealth,
            totalStamina: enemy.totalStamina,
            currentStamina: enemy.currentStamina,
            strength: enemy.strength,
            defense: enemy.defense,
            agility: enemy.agility,
            reflexes: enemy.reflexes,
        };

        this.database.saveGame(round, step, heroStats, enemyStats);
    }

    loadGame(callback) {
        this.database.loadGame((savePoint) => {
            if (savePoint) {
                const heroStats = JSON.parse(savePoint.heroStats);
                const enemyStats = JSON.parse(savePoint.enemyStats);

                callback({
                    round: savePoint.round,
                    step: savePoint.step,
                    heroStats: heroStats,
                    enemyStats: enemyStats,
                });
            } else {
                callback(null);
            }
        });
    }

    clearSaves() {
        this.database.clearSaves();
    }
}

const eventHandlers = new EventHandlers();

EventBus.on("saveGame", eventHandlers.saveGame.bind(eventHandlers));
EventBus.on("loadGame", eventHandlers.loadGame.bind(eventHandlers));
EventBus.on("clearSaves", eventHandlers.clearSaves.bind(eventHandlers));

export default eventHandlers;
