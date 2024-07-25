import { Scene } from "phaser";
import { EventBus } from "../EventBus";

export class CharacterSelectionScene extends Scene {
    constructor() {
        super({ key: "CharacterSelectionScene" });
    }

    preload() {
        this.load.image('heroSprite', 'assets/heroSprite.png');
        this.load.image('enemySprite', 'assets/enemySprite.png');
        this.load.image('backgroundSelect', 'assets/gym3.png');
    }

    create() {
        this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'backgroundSelect');

        this.add.text(this.cameras.main.width / 2, 60, 'CHOOSE YOUR CHARACTER', {
            fontFamily: 'Arial Black',
            fontSize: 48,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 7,
            align: 'center'
        }).setOrigin(0.5);

        const hero = this.registry.get('hero');
        const enemy = this.registry.get('enemy');

        const statsTextStyle = {
            fontFamily: 'Arial',
            fontSize: 22.5,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3,
            align: 'center'
        };

        const originalBoxHeight = 200;
        const increasedBoxHeight = originalBoxHeight * 3;
        const bottomMargin = 50;
        const sideMargin = 75;
        const increasedBoxY = this.cameras.main.height - bottomMargin - (increasedBoxHeight / 2);
        const defaultBoxColor = 0x000000;
        const defaultBoxAlpha = 0.6;
        const heroBoxColorHover = 0x1a1c42;
        const enemyBoxColorHover = 0x701010;

        const heroStatsBgStyle = { x: 200 + sideMargin, y: increasedBoxY, width: 350, height: increasedBoxHeight, color: defaultBoxColor, alpha: defaultBoxAlpha };

        const heroStatsBg = this.add.graphics()
            .fillStyle(heroStatsBgStyle.color, heroStatsBgStyle.alpha)
            .fillRect(heroStatsBgStyle.x - heroStatsBgStyle.width / 2, heroStatsBgStyle.y - heroStatsBgStyle.height / 2, heroStatsBgStyle.width, heroStatsBgStyle.height);

        const heroSprite = this.add.image(200 + sideMargin, 300, 'heroSprite').setInteractive();

        this.add.text(200 + sideMargin, 475, 'SANTI', {
            fontFamily: 'Arial Black',
            fontSize: 32,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 5,
            align: 'center'
        }).setOrigin(0.5);

        this.add.text(200 + sideMargin, increasedBoxY + 180, `HEALTH: ${hero.totalHealth}\nSTAMINA: ${hero.totalStamina}\nPOWER: ${hero.strength}\nDEFENSE: ${hero.defense}\nAGILITY: ${hero.agility}\nREFLEX: ${hero.reflexes}`, statsTextStyle).setOrigin(0.5);

        const heroInteractiveArea = this.add.zone(200 + sideMargin, (300 + increasedBoxY) / 2, heroStatsBgStyle.width, increasedBoxHeight + 150)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        heroInteractiveArea.on('pointerdown', () => {
            this.selectCharacter('Hero', hero);
        });

        heroInteractiveArea.on('pointerover', () => {
            heroStatsBg.clear().fillStyle(heroBoxColorHover, 0.8).fillRect(heroStatsBgStyle.x - heroStatsBgStyle.width / 2, heroStatsBgStyle.y - heroStatsBgStyle.height / 2, heroStatsBgStyle.width, heroStatsBgStyle.height);
        });

        heroInteractiveArea.on('pointerout', () => {
            heroStatsBg.clear().fillStyle(heroStatsBgStyle.color, heroStatsBgStyle.alpha).fillRect(heroStatsBgStyle.x - heroStatsBgStyle.width / 2, heroStatsBgStyle.y - heroStatsBgStyle.height / 2, heroStatsBgStyle.width, heroStatsBgStyle.height);
        });

        const enemyStatsBgStyle = { ...heroStatsBgStyle, x: this.cameras.main.width - (200 + sideMargin) };

        const enemyStatsBg = this.add.graphics()
            .fillStyle(enemyStatsBgStyle.color, enemyStatsBgStyle.alpha)
            .fillRect(enemyStatsBgStyle.x - enemyStatsBgStyle.width / 2, enemyStatsBgStyle.y - enemyStatsBgStyle.height / 2, enemyStatsBgStyle.width, enemyStatsBgStyle.height);

        const enemySprite = this.add.image(this.cameras.main.width - (200 + sideMargin), 300, 'enemySprite').setInteractive();

        this.add.text(this.cameras.main.width - (200 + sideMargin), 475, 'MATU', {
            fontFamily: 'Arial Black',
            fontSize: 32,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 5,
            align: 'center'
        }).setOrigin(0.5);

        this.add.text(this.cameras.main.width - (200 + sideMargin), increasedBoxY + 180, `HEALTH: ${enemy.totalHealth}\nSTAMINA: ${enemy.totalStamina}\nPOWER: ${enemy.strength}\nDEFENSE: ${enemy.defense}\nAGILITY: ${enemy.agility}\nREFLEX: ${enemy.reflexes}`, statsTextStyle).setOrigin(0.5);

        const enemyInteractiveArea = this.add.zone(this.cameras.main.width - (200 + sideMargin), (300 + increasedBoxY) / 2, enemyStatsBgStyle.width, increasedBoxHeight + 150)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        enemyInteractiveArea.on('pointerdown', () => {
            this.selectCharacter('Enemy', enemy);
        });

        enemyInteractiveArea.on('pointerover', () => {
            enemyStatsBg.clear().fillStyle(enemyBoxColorHover, 0.8).fillRect(enemyStatsBgStyle.x - enemyStatsBgStyle.width / 2, enemyStatsBgStyle.y - enemyStatsBgStyle.height / 2, enemyStatsBgStyle.width, enemyStatsBgStyle.height);
        });

        enemyInteractiveArea.on('pointerout', () => {
            enemyStatsBg.clear().fillStyle(enemyStatsBgStyle.color, enemyStatsBgStyle.alpha).fillRect(enemyStatsBgStyle.x - enemyStatsBgStyle.width / 2, enemyStatsBgStyle.y - enemyStatsBgStyle.height / 2, enemyStatsBgStyle.width, enemyStatsBgStyle.height);
        });

        // Removed automatic selection of 'Hero'
        // this.selectCharacter('Hero', hero);
    }

    selectCharacter(characterName, character) {
        console.log('Character selected:', characterName);
        this.registry.set('selectedCharacter', character);
        EventBus.emit('characterSelected', characterName);
        this.scene.start('Spar'); // Ensure this starts the Spar scene upon selection
    }
}
