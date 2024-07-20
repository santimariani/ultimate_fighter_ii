import Character from "./Character";

class CombatActions {
    constructor(character, opponent) {
        this.character = character;
        this.opponent = opponent;
        this.attackTypes = {
            punch: { requiredStamina: 10, damageMultiplier: 1.5, luckFactor: 0.75 },
            kick: { requiredStamina: 20, damageMultiplier: 3, luckFactor: 0.5 },
        };
    }

    performAttack(attackType) {
        const { requiredStamina, damageMultiplier, luckFactor } = this.attackTypes[attackType];
        if (this.opponent.currentHealth > 0 && this.character.currentStamina >= requiredStamina) {
            this.character.updateStamina(-requiredStamina);

            if (this.attackHits()) {
                this.calculateDamage(damageMultiplier, luckFactor);
            } else {
                console.log(`${this.character.name} misses!`);
            }
        } else {
            console.log(`${this.character.name} is too exhausted and misses`);
            this.character.updateStamina(-this.character.currentStamina);
        }
    }

    attackHits() {
        let characterAgility, opponentReflexes;

        do {
            console.log(`${this.character.name} moves in for the attack...`);
            characterAgility = Math.ceil(
                Phaser.Math.Between((this.character.agility / 2), this.character.agility) * this.character.swiftnessBoost
            );
            console.log(`${this.character.name} — offensive agility: ${characterAgility}`);
            opponentReflexes = Phaser.Math.Between(1, this.opponent.reflexes);
            console.log(`${this.opponent.name} — defensive reflexes: ${opponentReflexes}`);
        } while (characterAgility === opponentReflexes);

        return characterAgility > opponentReflexes;
    }

    calculateDamage(damageMultiplier, luckFactor) {
        console.log(`${this.character.name} prepares to attack...`);
        let characterStrength = Math.ceil(
            Phaser.Math.Between((this.character.strength / 2), this.character.strength) * this.character.powerBoost
        );
        console.log(`${this.character.name} — offensive power: ${characterStrength}`);
        let opponentDefense = Phaser.Math.Between(1, this.opponent.defense);
        if (opponentDefense > this.opponent.currentStamina) {
            opponentDefense = this.opponent.currentStamina;
        }
        console.log(`${this.opponent.name} — defensive power: ${opponentDefense}`);

        let basicDamage = characterStrength - opponentDefense;
        if (basicDamage <= 0) {
            basicDamage = 0;
            console.log(`${this.character.name} lands a blow but ${this.opponent.name} blocks all the damage!`);
        } else {
            const luck = Phaser.Math.Between(0, 1);
            const totalDamage = luck > luckFactor ? Math.ceil(basicDamage * damageMultiplier) : basicDamage;
            console.log(`${this.opponent.name} blocks ${opponentDefense} damage and ${this.character.name} deals ${totalDamage} damage`);
            this.opponent.updateHealth(totalDamage * -1);
        }
        const damageBlocked = characterStrength - basicDamage;
        this.opponent.updateStamina(damageBlocked * -1);
        console.log(`${this.opponent.name} used up ${damageBlocked} stamina from blocking the attack.`);
    }

    punch() {
        this.performAttack('punch');
    }

    kick() {
        this.performAttack('kick');
    }

    specialMove() {
        console.log("Haven't learned a special move yet!")
    }

    guard() {
        console.log(`${this.character.name} defends!`);
        const healthIncrease = Math.ceil(
            this.character.defense + this.character.strength
        );
        const staminaIncrease = Math.ceil(
            this.character.agility + this.character.reflexes
        );
        console.log(`${this.character.name}'s health increased ${healthIncrease} and stamina ${staminaIncrease}`);
        this.character.updateHealth(healthIncrease * 1);
        this.character.updateStamina(staminaIncrease * 1);
    }
}

export default CombatActions;