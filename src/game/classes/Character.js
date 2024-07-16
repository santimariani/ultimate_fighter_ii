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
    }

    updateHealth(amount) {
        this.currentHealth += amount;
        if (this.currentHealth > this.totalHealth) {
            this.currentHealth = this.totalHealth;
        }
    }

    updateStamina(amount) {
        this.currentStamina += amount;
        if (this.currentStamina > this.totalStamina) {
          this.currentStamina = this.totalStamina;
      }
    }
}
