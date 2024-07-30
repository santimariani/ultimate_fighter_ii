export class Character {
    constructor({
        name,
        totalHealth,
        currentHealth,
        totalStamina,
        currentStamina,
        strength,
        defense,
        agility,
        reflexes,
        sprite = null,
    }) {
        this.name = name;
        this.totalHealth = totalHealth;
        this.currentHealth = currentHealth;
        this.totalStamina = totalStamina;
        this.currentStamina = currentStamina;
        this.strength = strength;
        this.defense = defense;
        this.agility = agility;
        this.reflexes = reflexes;
        this.sprite = sprite; 
    }
    updateHealth(amount) {
        this.currentHealth += amount;
        if (this.currentHealth > this.totalHealth) {
            this.currentHealth = this.totalHealth;
        }
        if (this.currentHealth <= 0) {
            this.currentHealth = 0;
        }
    }

    updateStamina(amount) {
        this.currentStamina += amount;
        if (this.currentStamina > this.totalStamina) {
            this.currentStamina = this.totalStamina;
        }
        if (this.currentStamina <= 0) {
            this.currentStamina = 0;
        }
    }

    get powerBoost() {
        return this.currentHealth / this.totalHealth + 1;
    }

    get swiftnessBoost() {
        return this.currentStamina / this.totalStamina + 1;
    }
}

export default Character;