import { Scene } from "phaser";
import { EventBus } from "../EventBus";

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
        EventBus.on("muteGame", this.muteGame, this);
        EventBus.on("pauseGame", this.pauseGame, this);
        EventBus.on("resumeGame", this.resumeGame, this);

        const centerPauseX = this.cameras.main.width / 2;
        const centerPauseY = this.cameras.main.height / 2;
        this.pauseBackground = this.add.graphics();
        this.pauseBackground.fillStyle(0x000000, 0.9);
        this.pauseBackground.fillRect(
            centerPauseX - 200,
            centerPauseY - 100,
            400,
            200
        );
        this.pauseBackground.setVisible(false);
        this.pauseBackground.setDepth(14); 

        this.pauseText = this.add
            .text(centerPauseX, centerPauseY, "Game Paused", {
                fontFamily: "Arial Black",
                fontSize: 32,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 6,
                align: "center",
            })
            .setOrigin(0.5)
            .setVisible(false)
            .setInteractive()
            .on("pointerdown", () => {
                this.resumeGame();
                EventBus.emit("resumeGame");
            });
        this.pauseText.setDepth(15); // Set a high depth value

        const titleText = this.add.text(
            this.cameras.main.width / 2,
            60,
            'CHOOSE YOUR CHARACTER',
            {
                fontFamily: 'Arial Black',
                fontSize: 48,
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 7,
                align: 'center'
            }
        ).setOrigin(0.5);

        // Apply the same grow-and-shrink animation to the title text
        this.tweens.add({
            targets: titleText,
            scaleX: 1.02,
            scaleY: 1.02,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

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
        const defaultBoxColor = 0x000000; // Default color
        const defaultBoxAlpha = 0.6; // Opacity set to half
        const heroBoxColorHover = 0x1a1c42; // Blue hover color for hero
        const enemyBoxColorHover = 0x701010; // Red hover color for enemy

        // Stats background rectangle style for hero
        const heroStatsBgStyle = { x: 200 + sideMargin, y: increasedBoxY, width: 350, height: increasedBoxHeight, color: defaultBoxColor, alpha: defaultBoxAlpha };

        // Draw background rectangle for hero stats
        const heroStatsBg = this.add.graphics()
            .fillStyle(heroStatsBgStyle.color, heroStatsBgStyle.alpha)
            .fillRect(heroStatsBgStyle.x - heroStatsBgStyle.width / 2, heroStatsBgStyle.y - heroStatsBgStyle.height / 2, heroStatsBgStyle.width, heroStatsBgStyle.height);

        // Apply the grow-and-shrink animation to the hero stats background
        this.tweens.add({
            targets: heroStatsBg,
            scaleX: 1.00,
            scaleY: 1.01,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Character 1: Hero
        const heroSprite = this.add.image(200 + sideMargin, 300, 'heroSprite').setInteractive();

        // Hero Name
        this.add.text(200 + sideMargin, 475, 'SANTI', {
            fontFamily: 'Arial Black',
            fontSize: 32,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 5,
            align: 'center'
        }).setOrigin(0.5);

        // Hero Stats
        this.add.text(200 + sideMargin, increasedBoxY + 180, `HEALTH: ${hero.totalHealth}\nSTAMINA: ${hero.totalStamina}\nPOWER: ${hero.strength}\nDEFENSE: ${hero.defense}\nAGILITY: ${hero.agility}\nREFLEX: ${hero.reflexes}`, statsTextStyle).setOrigin(0.5);

        // Create an invisible interactive area that covers both the character and the box
        const heroInteractiveArea = this.add.zone(200 + sideMargin, (300 + increasedBoxY) / 2, heroStatsBgStyle.width, increasedBoxHeight + 150)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        heroInteractiveArea.on('pointerdown', () => {
            this.selectCharacter('Hero');
        });
        
        heroInteractiveArea.on('pointerover', () => {
            heroStatsBg.clear().fillStyle(heroBoxColorHover, 0.8).fillRect(heroStatsBgStyle.x - heroStatsBgStyle.width / 2, heroStatsBgStyle.y - heroStatsBgStyle.height / 2, heroStatsBgStyle.width, heroStatsBgStyle.height);
        });
        
        heroInteractiveArea.on('pointerout', () => {
            heroStatsBg.clear().fillStyle(heroStatsBgStyle.color, heroStatsBgStyle.alpha).fillRect(heroStatsBgStyle.x - heroStatsBgStyle.width / 2, heroStatsBgStyle.y - heroStatsBgStyle.height / 2, heroStatsBgStyle.width, heroStatsBgStyle.height);
        });

        // Stats background rectangle style for enemy
        const enemyStatsBgStyle = { ...heroStatsBgStyle, x: this.cameras.main.width - (200 + sideMargin) };

        // Draw background rectangle for enemy stats
        const enemyStatsBg = this.add.graphics()
            .fillStyle(enemyStatsBgStyle.color, enemyStatsBgStyle.alpha)
            .fillRect(enemyStatsBgStyle.x - enemyStatsBgStyle.width / 2, enemyStatsBgStyle.y - enemyStatsBgStyle.height / 2, enemyStatsBgStyle.width, enemyStatsBgStyle.height);

        // Apply the grow-and-shrink animation to the enemy stats background
        this.tweens.add({
            targets: enemyStatsBg,
            scaleX: 1.00,
            scaleY: 1.01,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Character 2: Enemy
        const enemySprite = this.add.image(this.cameras.main.width - (200 + sideMargin), 300, 'enemySprite').setInteractive();

        // Enemy Name
        this.add.text(this.cameras.main.width - (200 + sideMargin), 475, 'MATU', {
            fontFamily: 'Arial Black',
            fontSize: 32,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 5,
            align: 'center'
        }).setOrigin(0.5);

        // Enemy Stats
        this.add.text(this.cameras.main.width - (200 + sideMargin), increasedBoxY + 180, `HEALTH: ${enemy.totalHealth}\nSTAMINA: ${enemy.totalStamina}\nPOWER: ${enemy.strength}\nDEFENSE: ${enemy.defense}\nAGILITY: ${enemy.agility}\nREFLEX: ${enemy.reflexes}`, statsTextStyle).setOrigin(0.5);

        // Create an invisible interactive area for enemy
        const enemyInteractiveArea = this.add.zone(this.cameras.main.width - (200 + sideMargin), (300 + increasedBoxY) / 2, enemyStatsBgStyle.width, increasedBoxHeight + 150)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        enemyInteractiveArea.on('pointerdown', () => {
            this.selectCharacter('Enemy');
        });
        
        enemyInteractiveArea.on('pointerover', () => {
            enemyStatsBg.clear().fillStyle(enemyBoxColorHover, 0.8).fillRect(enemyStatsBgStyle.x - enemyStatsBgStyle.width / 2, enemyStatsBgStyle.y - enemyStatsBgStyle.height / 2, enemyStatsBgStyle.width, enemyStatsBgStyle.height);
        });
        
        enemyInteractiveArea.on('pointerout', () => {
            enemyStatsBg.clear().fillStyle(enemyStatsBgStyle.color, enemyStatsBgStyle.alpha).fillRect(enemyStatsBgStyle.x - enemyStatsBgStyle.width / 2, enemyStatsBgStyle.y - enemyStatsBgStyle.height / 2, enemyStatsBgStyle.width, enemyStatsBgStyle.height);
        });

        EventBus.on('goToNextScene', () => {
            this.stopMusic(); // Stop music when transitioning to Spar scene
            this.scene.start('Spar');
        });

        EventBus.on('goToPreviousScene', () => {
            this.stopMusic(); // Stop music when transitioning to Spar scene
            this.scene.start('MainMenu');
        });
    }

    selectCharacter(characterName) {
        console.log('Character selected:', characterName);
        // Save selected character and transition to the next scene
        this.stopMusic(); // Stop music when transitioning to Spar scene
        this.scene.start('Spar', { selectedCharacter: characterName });
    }

    stopMusic() {
        if (this.sound.get('menuIntro')) {
            this.sound.stopByKey('menuIntro');
        }
        if (this.sound.get('menuLoop')) {
            this.sound.stopByKey('menuLoop');
        }
    }

    muteGame() {
        this.sound.mute = !this.sound.mute;
    }

    pauseGame() {
        this.scene.pause();

        this.isGamePaused = true;
        this.pauseBackground.setVisible(true);
        this.pauseText.setVisible(true);
    }

    resumeGame() {
        this.scene.resume();

        this.isGamePaused = false;
        this.pauseBackground.setVisible(false);
        this.pauseText.setVisible(false);
    }
}
