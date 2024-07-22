import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

        this.load.image('background', 'assets/bg.png');
        this.load.image('gym', 'assets/gym.png');
        this.load.image('matu', 'assets/matu.png');
        this.load.image('santi', 'assets/santi.png');
        this.load.image('healthBar', 'assets/healthBar.png');
        this.load.image('roundNumber', 'assets/roundNumber.png');
        this.load.image('options', 'assets/options.png');
        this.load.image('info', 'assets/info.png');


    }

    create ()
    {
        this.scene.start('Preloader');
    }
}
