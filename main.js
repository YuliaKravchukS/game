import './style.css'
import Phaser from 'phaser'

let player;
let cursors;
let target;
let points = 0;
const speedDown = 300;
const playerSpeed = speedDown + 50;
console.log('playerSpeed: ', playerSpeed);
const sizes={
  width:500,
  height:500
}


const config={
  type: Phaser.WEBGL,
  width:sizes.width,
  height:sizes.height,
  canvas:gameCanvas,
  physics:{
    default:'arcade',
    arcade:{
      gravity:{y:speedDown},
      debug:true,
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
}
}

function getRandomX() {
  return Math.floor(Math.random()*480);
}
  function getHit() {
    target.setY(0);
    target.setX(getRandomX());
    points++;
  }

const game = new Phaser.Game(config);


// class GameScene extends Phaser.Scene{
//   constructor(){
//     super('scene-game')
//   }
function  preload(){
    this.load.image('bg', 'assets/bg.png')
    this.load.image('basket', 'assets/basket.png')
    this.load.image('apple', 'assets/apple.png')
  };

  function  create(){
   
    this.add.image(0, 0,'bg').setOrigin(0, 0)     
    player = this.physics.add.image(0, sizes.height-100,'basket').setOrigin(0, 0)
    player.setImmovable(true)
    player.body.allowGravity = false
    // player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    target=this.physics.add.image(0,0,'apple').setOrigin(0, 0)   
    target.setMaxVelocity(0,speedDown) 
    this.physics.add.overlap(target, player, getHit, null, this)
    cursors = this.input.keyboard.createCursorKeys();
  };
 
  function  update(){
    if(target.y>=sizes.height){
      target.setY(0);
      target.setX(getRandomX());
    }

if (cursors.left.isDown) {
  player.setVelocityX(-playerSpeed)
}else if(cursors.right.isDown){
  player.setVelocityX(playerSpeed)
  
}else{
  player.setVelocityX(0);
}

 };

