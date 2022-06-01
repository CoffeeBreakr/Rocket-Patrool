class Play extends Phaser.Scene{
    constructor() {
        super("playScene");
    }

    preload() {
        // Load sprites
        this.load.image('rocketship','./assets/rocket.png');
        this.load.image('spaceship','./assets/enemy.png');
        this.load.image('spaceship2','./assets/enemy2.png');
        this.load.image('spaceship3','./assets/enemy3.png');
        this.load.image('starfield','./assets/background.png');
        this.load.image('rocket','/assets/rocketP.png')
        this.load.image('forefield','/assets/foreground.png')
        // Load spritesheet
        this.load.spritesheet('explosion', './assets/enemyExplosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
      }

    create() {
        // UI Background
        this.add.rectangle(0,borderUISize + borderPadding, game.config.width, borderUISize * 2, 0xB7B7A4).setOrigin(0,0);
        // Place sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        this.forefield = this.add.tileSprite(0, 0, 640, 480, 'forefield').setOrigin(0, 0);
        // UI Borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0x6B705C).setOrigin(0,0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0x6B705C).setOrigin(0,0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0x6B705C).setOrigin(0,0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0x6B705C).setOrigin(0,0);
        // Add player/rocket
        //this.p1RocketShip = new RocketShip(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocketship').setOrigin(0.5, 0);
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);
        // Add Spaceships
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship3', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship2', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0,0);
        // Define Keys
        keyZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        keyX = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        // Animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });
        // Initialize score
        this.p1Score = 0;
        // Display score
        let scoreConfig = {
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
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);

        // GAME OVER flag
        this.gameOver = false;

        // 60-second play clock
        //this.timeLeft = 60000;

        let timeConfig = {
            fontFamily: 'Courier',
            fontSize: '22px',
            backgroundColor: '#CB997E',
            color: '#FFE8D6',
            align: 'right',
            padding: {
                top: 2,
                bottom: 2,
            },
            fixedWidth: 100
        }

        this.timeLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*0.5, game.settings.gameTimer, timeConfig)
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
        this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (X) to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
        this.gameOver = true;
        }, null, this);

        


    }

    
    update() {
        // Check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyX)) {
            this.scene.restart();
            }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        // Background
        this.starfield.tilePositionX -= 4;
        this.forefield.tilePositionX -= 1;
        // Rocket Update
        this.p1Rocket.update();
        // This.p1RocketShip.update();
  
        // Spaceship Update
        this.ship01.update();
        this.ship02.update();
        this.ship03.update();

        // Check collisions
        if(this.checkCollision(this.p1Rocket, this.ship01)) {
           this.p1Rocket.reset();
           this.shipExplode3(this.ship01);   
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode2(this.ship02);   
        }
        if (this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);   
        }

        if (!this.gameOver) {               
            this.p1Rocket.update();         // Update rocket sprite
            this.ship01.update();           // Update spaceships (x3)
            this.ship02.update();
            this.ship03.update();
        } 
        
        //Timer
        //this.timeLeft -= delta;

    }

    checkCollision(rocket, ship) {
        // Simple AABB checking
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) { //Ship Score 30
        // Temporarily hide ship
        ship.alpha = 0;
        // Create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // Play explode animation
        boom.on('animationcomplete', () => {    // Callback after anim completes
          ship.reset();                         // Reset ship position
          ship.alpha = 1;                       // Make ship visible again
          boom.destroy();                       // Remove explosion sprite
        });  
        // Score add and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;   
        this.sound.play('sfx_explosion');   
    }

    shipExplode2(ship) { //Ship3 Score changed to 40
        // Temporarily hide ship
        ship.alpha = 0;
        // Create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // Play explode animation
        boom.on('animationcomplete', () => {    // Callback after anim completes
          ship.reset();                         // Reset ship position
          ship.alpha = 1;                       // Make ship visible again
          boom.destroy();                       // Remove explosion sprite
        });  
        // Score add and repaint
        this.p1Score += (40);
        //console.log(ship.points*1.5);
        this.scoreLeft.text = this.p1Score;   
        this.sound.play('sfx_explosion');   
    }

    shipExplode3(ship) { //Ship3 Score changed to 100
        // Temporarily hide ship
        ship.alpha = 0;
        // Create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // Play explode animation
        boom.on('animationcomplete', () => {    // Callback after anim completes
          ship.reset();                         // Reset ship position
          ship.alpha = 1;                       // Make ship visible again
          boom.destroy();                       // Remove explosion sprite
        });  
        // Score add and repaint
        this.p1Score += (100);
        //console.log(ship.points*3);
        this.scoreLeft.text = this.p1Score;   
        this.sound.play('sfx_explosion');   
    }
}