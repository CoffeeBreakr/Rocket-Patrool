class Menu extends Phaser.Scene {
  constructor() {
    super("menuScene");
  }

  preload() {

    //load images
    this.load.image('forefield', './assets/foreground.png');
    this.load.image('starfield', './assets/background.png');

    // Load audio
    this.load.audio('sfx_select', './assets/blip_select.wav');
    this.load.audio('sfx_explosion', './assets/explosion.wav');
    this.load.audio('sfx_rocket', './assets/rocket_shot.wav');
  }

  create() {
    // Place sprite
    this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
    this.forefield = this.add.tileSprite(0, 0, 640, 480, 'forefield').setOrigin(0, 0);

    // Menu Text
    let menuConfig = {
      fontFamily: 'Courier',
      fontSize: '23px',
      backgroundColor: '#CB997E',
      color: '#FFE8D6',
      align: 'right',
      padding: {
        top: 5,
        bottom: 5,
      },
      fixedWidth: 0
    }
    // Show menu text
    menuConfig.fontSize = '30px';
    this.add.text(game.config.width / 2, game.config.height / 2 - borderUISize - borderPadding, '---- ROCKET PATR0L ----', menuConfig).setOrigin(0.5);
    menuConfig.fontSize = '23px';
    this.add.text(game.config.width / 2, game.config.height / 2, 'P1: Use (← →) keys to move & (↑) keys to fire', menuConfig).setOrigin(0.5);
    this.add.text(game.config.width / 2, game.config.height / 2 + borderUISize + borderPadding, 'P2: Use (A)(D) keys to move & (S) to fire', menuConfig).setOrigin(0.5);
    this.add.text(game.config.width / 2, game.config.height / 2 + (2 * (borderUISize + borderPadding)), 'Press <- for Novice or -> for Expert', menuConfig).setOrigin(0.5);

    // Define keys
    keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

    // Display score
    /*let scoreConfig = {
      fontFamily: 'Courier',
      fontSize: '28px',
      backgroundColor: '#CB997E',
      color: '#FFE8D6',
      align: 'right',
      padding: {
        top: 5,
        bottom: 5,
      },
      fixedWidth: 100
    }

    this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding * 2, game.scoreLeft, scoreConfig);*/
  } 

  update() {
    if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
      // easy mode
      game.settings = {
        spaceshipSpeed: 3,
        specialshipSpeed: 4,
        gameTimer: 60000
      }
      this.sound.play('sfx_select');
      this.scene.start('playScene');
    }
    if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
      // hard mode
      game.settings = {
        spaceshipSpeed: 4,
        specialshipSpeed: 5,
        gameTimer: 45000
      }
      this.sound.play('sfx_select');
      this.scene.start('playScene');
    }

    //Parallax
    this.starfield.tilePositionX -= 0.3;
    this.forefield.tilePositionX += 0.5;

  }
}