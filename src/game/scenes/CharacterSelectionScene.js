import { Scene } from "phaser";

export class CharacterSelectionScene extends Scene {
    constructor() {
        super({ key: "CharacterSelectionScene" });
    }

    preload() {
        // Load any assets specific to this scene
        this.load.image('heroSprite', 'assets/heroSprite.png');
        this.load.image('enemySprite', 'assets/enemySprite.png');
        this.load.image('backgroundSelect', 'assets/gym3.png');
    }

    create() {
        // Set background
        this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'backgroundSelect');

        // Title Text
        this.add.text(this.cameras.main.width / 2, 50, 'CHOOSE YOUR CHARACTER', {
            fontFamily: 'Arial Black',
            fontSize: 48,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 7,
            align: 'center'
        }).setOrigin(0.5);

        // Fetch character data from the registry
        const hero = this.registry.get('hero');
        const enemy = this.registry.get('enemy');

        // Common styles for stats text
        const statsTextStyle = {
            fontFamily: 'Arial',
            fontSize: 22.5,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3,
            align: 'center'
        };

        // Set the height and Y position for the stats boxes
        const originalBoxHeight = 200;
        const increasedBoxHeight = originalBoxHeight * 3; // 50% taller
        const bottomMargin = 50;
        const sideMargin = 75; // Side margin
        const increasedBoxY = this.cameras.main.height - bottomMargin - (increasedBoxHeight / 2);

        // Stats background rectangle style
        const statsBgStyle = { x: 200 + sideMargin, y: increasedBoxY, width: 350, height: increasedBoxHeight, color: 0x000000, alpha: 0.5 };

        // Draw background rectangle for hero stats
        this.add.graphics()
            .fillStyle(statsBgStyle.color, statsBgStyle.alpha)
            .fillRect(statsBgStyle.x - statsBgStyle.width / 2, statsBgStyle.y - statsBgStyle.height / 2, statsBgStyle.width, statsBgStyle.height);

        // Character 1: Hero
        const heroSprite = this.add.image(200 + sideMargin, 300, 'heroSprite').setInteractive();
        this.add.text(200 + sideMargin, 475, 'HERO', {
            fontFamily: 'Arial Black',
            fontSize: 32,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 5,
            align: 'center'
        }).setOrigin(0.5);

        // Hero Stats
        this.add.text(200 + sideMargin, increasedBoxY + 180, `HEALTH: ${hero.totalHealth}\nSTAMINA: ${hero.totalStamina}\nPOWER: ${hero.strength}\nDEFENSE: ${hero.defense}\nAGILITY: ${hero.agility}\nREFLEX: ${hero.reflexes}`, statsTextStyle).setOrigin(0.5);

        heroSprite.on('pointerdown', () => {
            this.selectCharacter('Hero');
        });

        // Draw background rectangle for enemy stats
        const enemyStatsBgStyle = { ...statsBgStyle, x: this.cameras.main.width - (200 + sideMargin) };
        this.add.graphics()
            .fillStyle(enemyStatsBgStyle.color, enemyStatsBgStyle.alpha)
            .fillRect(enemyStatsBgStyle.x - enemyStatsBgStyle.width / 2, enemyStatsBgStyle.y - enemyStatsBgStyle.height / 2, enemyStatsBgStyle.width, enemyStatsBgStyle.height);

        // Character 2: Enemy
        const enemySprite = this.add.image(this.cameras.main.width - (200 + sideMargin), 300, 'enemySprite').setInteractive();
        this.add.text(this.cameras.main.width - (200 + sideMargin), 475, 'ENEMY', {
            fontFamily: 'Arial Black',
            fontSize: 32,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 5,
            align: 'center'
        }).setOrigin(0.5);

        // Enemy Stats
        this.add.text(this.cameras.main.width - (200 + sideMargin), increasedBoxY + 180, `HEALTH: ${enemy.totalHealth}\nSTAMINA: ${enemy.totalStamina}\nPOWER: ${enemy.strength}\nDEFENSE: ${enemy.defense}\nAGILITY: ${enemy.agility}\nREFLEX: ${enemy.reflexes}`, statsTextStyle).setOrigin(0.5);

        enemySprite.on('pointerdown', () => {
            this.selectCharacter('Enemy');
        });
    }

    selectCharacter(characterName) {
        console.log('Character selected:', characterName);
        // Save selected character and transition to the next scene
        this.scene.start('NextScene', { selectedCharacter: characterName });
    }
}
