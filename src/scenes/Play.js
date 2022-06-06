class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // Load sprites
        this.load.image('rocketship', './assets/rocket.png');
        this.load.image('spaceship', './assets/enemy.png');
        this.load.image('spaceship2', './assets/enemy2.png');
        this.load.image('spaceship3', './assets/enemy3.png');
        this.load.image('starfield', './assets/background.png');
        this.load.image('rocket', './assets/rocketP.png');
        this.load.image('rocket2', './assets/rocketP2.png');
        // Load spritesheet
        this.load.spritesheet('explosion', './assets/enemyExplosion.png', { frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9 });

        this.timeRemaining = game.settings.gameTimer;
    }

    create() {
        // UI Background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0xB7B7A4).setOrigin(0, 0);
        // Place sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        this.forefield = this.add.tileSprite(0, 0, 640, 480, 'forefield').setOrigin(0, 0);
        // UI Borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0x6B705C).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0x6B705C).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0x6B705C).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0x6B705C).setOrigin(0, 0);
        // Add player/rocket
        //this.p1RocketShip = new RocketShip(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocketship').setOrigin(0.5, 0);
        this.p1Rocket = new Rocket(this, game.config.width / 2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);
        this.p2Rocket = new Rocket2(this, game.config.width / 2, game.config.height - borderUISize - borderPadding, 'rocket2').setOrigin(0.5, 0);
        // Add Spaceships
        this.ship01 = new Specialship(this, game.config.width + borderUISize * 6, borderUISize * 4, 'spaceship3', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize * 3, borderUISize * 5 + borderPadding * 2, 'spaceship2', 0, 20).setOrigin(0, 0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize * 6 + borderPadding * 4, 'spaceship', 0, 10).setOrigin(0, 0);
        // Define Keys
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyX = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        // Animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0 }),
            frameRate: 30
        });

        // Initialize score
        this.p1Score = 0;
        this.p2Score = 0;

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

        //display score
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding * 2, (this.p1Score + this.p2Score), scoreConfig);

        scoreConfig.fixedWidth = 250;
        scoreConfig.align = 'left';
        this.scorep1 =  this.add.text(game.config.width - 630, game.config.height - 470 ,'Player 1: ' +  (this.p1Score), scoreConfig);
        this.scorep2 =  this.add.text(game.config.width - 230, game.config.height - 470,'Player 2: ' + (this.p2Score), scoreConfig);

        // GAME OVER flag
        this.gameOver = false;

        // 60-second play clock
        this.timeLeft = game.settings.gameTimer * 0.001;
        this.iniTime = this.time.now;

        //display timer
        scoreConfig.fixedWidth = 100;
        scoreConfig.align = 'left';
        this.timeText = this.add.text(game.config.width - 144, borderUISize + borderPadding * 2, this.timeLeft, scoreConfig);


        //this.timeLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding * 0.5, this.timeRemaining, timeConfig)
        //scoreConfig.fixedWidth = 0;
        /* this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
             this.add.text(game.config.width / 2, game.config.height / 2, 'GAME OVER', scoreConfig).setOrigin(0.5);
             this.add.text(game.config.width / 2, game.config.height / 2 + 64, 'Press (X) to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
             this.gameOver = true;
         }, null, this); */




    }


    update() {

        //Hide all active assets and display gameover text game is over
        if (this.gameOver) {
            this.p1Rocket.alpha = 0;
            this.p2Rocket.alpha = 0;
            this.ship01.alpha = 0;
            this.ship02.alpha = 0;
            this.ship03.alpha = 0;

            this.add.text(game.config.width / 2, game.config.height / 2, 'GAME OVER', this.scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width / 2, game.config.height / 2 + 32, 'SCORE: ' + (this.p1Score + this.p2Score), this.scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width / 2, game.config.height / 2 + 96, 'Press (X) to Restart or ← for Menu', this.scoreConfig).setOrigin(0.5);

        }

        // Check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyX)) {
            this.scene.restart();
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        // Background
        this.starfield.tilePositionX -= 0.3;
        this.forefield.tilePositionX += 0.5;

        // Check collisions
        if (this.checkCollision(this.p1Rocket, this.ship01)) {     // Player 1 Collisions Check
            this.p1Rocket.reset();
            this.shipExplode3(this.ship01, 1);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode2(this.ship02, 1);
        }
        if (this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03, 1);
        }
        if (this.checkCollision(this.p2Rocket, this.ship01)) {     // Player 2 Collisions Check
            this.p2Rocket.reset();
            this.shipExplode3(this.ship01, 2);
        }
        if (this.checkCollision(this.p2Rocket, this.ship02)) {
            this.p2Rocket.reset();
            this.shipExplode2(this.ship02, 2);
        }
        if (this.checkCollision(this.p2Rocket, this.ship03)) {
            this.p2Rocket.reset();
            this.shipExplode(this.ship03, 2);
        }


        //If game is not over, update all active assets and timer countdown
        if (!this.gameOver) {

            this.p1Rocket.update();         // Update rocket sprite
            this.p2Rocket.update();
            this.ship01.update();           // Spaceship Update
            this.ship02.update();
            this.ship03.update();

            //timer update (info via friend)
            var timeLeft = (game.settings.gameTimer * 0.001) - ((this.time.now - this.iniTime) * 0.001);
            this.timeText.setText(Math.round(timeLeft)); // Math.round sets it so that there are no decimals when displayed
        }

        //Game ends when timer reaches 0
        //console.log(timeLeft);
        if (timeLeft <= 0) {
            //console.log("GAME OVER");
            this.gameOver = true;
        }

    }

    checkCollision(rocket, ship) {
        // Simple AABB checking
        if (rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y) {
            return true;
        } else {
            return false;
        }
    }

    shipExplode(ship, player) { //Ship Score 30
        //Check Status
        console.log("HAS BEEN HIT");

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
        if(player == 1){
            this.p1Score += ship.points;
        } 
        else if (player == 2)
        {
            this.p2Score += ship.points;
        }
        this.scoreLeft.text = this.p1Score + this.p2Score;
        this.scorep1.text = 'Player 1: ' +  this.p1Score;
        this.scorep2.text = 'Player 2: ' +  this.p2Score;
        console.log(this.p1Score + (",") + this.p2Score);

        this.sound.play('sfx_explosion');
    }

    shipExplode2(ship,player) { //Ship3 Score changed to 40
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
        this.p2Score += ship.points;
        // Score add and repaint
        if(player == 1){
            this.p1Score += ship.points;
        } 
        else if (player == 2)
        {
            this.p2Score += ship.points;
        }
        this.scoreLeft.text = this.p1Score + this.p2Score;
        this.scorep1.text = 'Player 1: ' +  this.p1Score;
        this.scorep2.text = 'Player 2: ' +  this.p2Score;
        console.log(this.p1Score + (",") + this.p2Score);

        

        this.sound.play('sfx_explosion');
    }

    shipExplode3(ship, player) { //Ship3 Score changed to 100
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
        this.p2Score += ship.points;
        // Score add and repaint
        if(player == 1){
            this.p1Score += ship.points;
        } 
        else if (player == 2)
        {
            this.p2Score += ship.points;
        }
        this.scoreLeft.text = this.p1Score + this.p2Score;
        this.scorep1.text = 'Player 1: ' +  this.p1Score;
        this.scorep2.text = 'Player 2: ' +  this.p2Score;
        console.log(this.p1Score + (",") + this.p2Score);


        this.sound.play('sfx_explosion');
    }
}