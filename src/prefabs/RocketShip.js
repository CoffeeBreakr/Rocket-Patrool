class RocketShip extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
      super(scene, x, y, texture, frame);
  
      // Add object to scene
      scene.add.existing(this);          // Add to existing
      this.hasFiring = false;            // Track rocket's firing status
      this.moveSpeed = 4;                // Px per Frame
    }

    update(){
    // Left Right Movement
        if(!this.hasFiring) {
            if(keyLEFT.isDown && this.x >= borderUISize + this.width) {
                this.x -= this.moveSpeed;
        } 
        else if(keyRIGHT.isDown && this.x <= game.config.width - borderUISize - this.width) {
            this.x += this.moveSpeed;
        }
    }
    // Fire Button
    if(Phaser.Input.Keyboard.JustDown(keyZ)) {
        this.hasFiring = true;
    }
    // Reset on miss
    if(this.y <= borderUISize * 3 + borderPadding) {
        this.hasFiring = false;
        this.y = game.config.height - borderUISize - borderPadding;
    }
  }
}