class Rocket2 extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
      super(scene, x, y, texture, frame);
  
      // Add object to scene
      scene.add.existing(this);                         // Add to existing
      this.isFiring = false;                            // Track rocket's firing status
      this.moveSpeed = 4;                               // Px per Frame
      this.sfxRocket = scene.sound.add('sfx_rocket');   // Add rocket sfx
      this.hasFired = false;                            // Checks if Rocket has fire (prevents sfx spam)
    }

    update(){
        // Left Right Movement
        if(!this.isFiring) {
            if(keyA.isDown && this.x >= borderUISize + this.width) {
                this.x -= this.moveSpeed;
            } 
            else if(keyD.isDown && this.x <= game.config.width - borderUISize - this.width) {
                this.x += this.moveSpeed;
            }
        }
        // Fire Button
        if(Phaser.Input.Keyboard.JustDown(keyS)) {
            this.isFiring = true;
            if(this.hasFired == false){
                this.sfxRocket.play();  // Play sfx
                this.hasFired = true;
            }

        }
        // If fired, Move up
        if(this.isFiring && this.y >= borderUISize * 3 + borderPadding) {
            this.y -= this.moveSpeed;
        }
        // Reset on miss
        if(this.y <= borderUISize * 3 + borderPadding) {
            this.isFiring = false;
            this.hasFired = false;
            this.y = game.config.height - borderUISize - borderPadding;
        }
    }

    // Reset Rocket
    reset() {
        this.isFiring = false;
        this.hasFired = false;
        this.y = game.config.height - borderUISize - borderPadding;
    }
  }