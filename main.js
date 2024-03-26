
import "./style.css";
import Phaser from "phaser";

let player;
let cursors;
let target;
let textScore;
let textTime;
let timedEvent;
let remainingTime;
let coinMusic;
let bombMusic;
let bgMusic;
let emitter;
let bomb;
let hitBombOccurred = false;
let points = 0;
const speedDown = 500;
const playerSpeed = speedDown + 50;

const sizes = {
  width: 500,
  height: 450,
};

const refs = {
  gameStartDiv: document.querySelector("#gameStarDiv"),
  gameStartBtn: document.querySelector("#gameStartBtn"),
  gameEndDiv: document.querySelector("#gameEndDiv"),
  gameWinLoseSpan: document.querySelector("#gameWinLoseSpan"),
  gameEndScoreSpan: document.querySelector("#gameEndScoreSpan"),
  gameRestartBtn: document.querySelector("#gameRestartBtn"),
  gameSpam: document.querySelector("#gameSpam"),
  link: document.querySelector("#link"),
  gameResult: document.querySelector("#gameResult"),
};
console.log(refs.link);
const config = {
  type: Phaser.CANVAS,
  width: sizes.width,
  height: sizes.height,
  canvas: gameCanvas,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: speedDown },
      debug: true,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

function getRandomX(x) {
  return Math.floor(Math.random() * x);
}

const game = new Phaser.Game(config);

function preload() {
  this.load.image("bgt", "assets/bgt.png");
  this.load.image("jar", "assets/jar.png");
  this.load.image("bit1", "assets/bit1.png");
  this.load.image("moneyd", "assets/moneyd.png");
  this.load.image("bomb", "assets/bomb.png");
  this.load.audio("bgDMusic", "assets/bgDMusic.mp3");
  this.load.audio("coin", "assets/coin.mp3");
  this.load.audio("bomb", "assets/bomb.wav");
}

function create() {
  this.scene.pause("scene-game");
  coinMusic = this.sound.add("coin");
  bombMusic = this.sound.add("bomb");
  bgMusic = this.sound.add("bgDMusic");
  bgMusic.play();
  //  bgMusic.stop();

  this.add.image(0, 0, "bgt").setOrigin(0, 0);
  player = this.physics.add.image(0, sizes.height, "jar");
  player.setImmovable(true);
  player.body.allowGravity = false;
  player.setCollideWorldBounds(true);
  player
    .setSize(player.width - player.width / 4, player.height / 6)
    .setOffset(player.width / 10, player.height - player.height / 10);
  target = this.physics.add.image(130, 0, "bit1").setOrigin(0, 0);

  target.setMaxVelocity(0, speedDown);
  this.physics.add.overlap(target, player, getHit, null, this);
  cursors = this.input.keyboard.createCursorKeys();
  textScore = this.add.text(sizes.width - 110, 16, "Score: 0", {
    fontSize: "22px Arial",
    fill: "#000",
  });
  textTime = this.add.text(16, 16, "Remaining Time: 00", {
    fontSize: "22px Arial",
    fill: "#000",
  });
  timedEvent = this.time.delayedCall(30000, gameOver, [], this);

  emitter = this.add.particles(0, 0, "moneyd", {
    speed: 80,
    gravityY: speedDown - 200,
    scale: 0.05,
    duration: 100,
    emitting: false,
  });
  emitter.startFollow(player, player.width / 10, player.height / 20, true);

  bomb = this.physics.add.image(sizes.width - 110, 0, "bomb");
  bomb.setMaxVelocity(0, speedDown);

  this.physics.add.overlap(player, bomb, hitBomb, null, this);

  function getHit() {
    coinMusic.play();
    target.setY(0);
    target.setX(getRandomX(400));
    points++;
    textScore.setText(`Score:${points}`);
    emitter.start();
  }
  function hitBomb() { 
   
      if (!hitBombOccurred) { 
        bombMusic.play();
        target.setY(0);
        target.setX(getRandomX(600));  
        points = Math.max(points - 1, 0); 
        textScore.setText(`Score:${points}`);
        hitBombOccurred = true;
      }
              
  }

  function gameOver() {
    this.sys.game.destroy(true);
    if (points >= 10) {
      refs.gameEndScoreSpan.textContent = points;
      refs.gameWinLoseSpan.textContent = "Victory🥳!";
      refs.gameSpam.textContent = "Please help Ukraine win! Donate👇";
      refs.gameResult.classList.add("resultWin");
    } else {
      refs.gameEndScoreSpan.textContent = points;
      refs.gameWinLoseSpan.textContent = "Lost!🙄";
      refs.gameSpam.textContent = "Don't forget to donate👇";
      refs.gameResult.classList.add("result");
    }
    refs.gameEndDiv.style.display = "flex";
    refs.link.style.display = "block";
  }
}

function update() {
  remainingTime = timedEvent.getRemainingSeconds();
  textTime.setText(`Remaining Time: ${Math.round(remainingTime).toString()}`);
  if (target.y >= sizes.height) {
    target.setY(0);
    target.setX(getRandomX(400));
  }
  if (bomb.y >= sizes.height) {
    bomb.setY(0);
    bomb.setX(getRandomX(600));
  }
  hitBombOccurred = false;

  if (cursors.left.isDown) {
    player.setVelocityX(-playerSpeed);
  } else if (cursors.right.isDown) {
    player.setVelocityX(playerSpeed);
  } else {
    player.setVelocityX(0);
  }
}

refs.gameStartBtn.addEventListener("click", () => {
  refs.gameStartDiv.style.display = "none";
  game.scene.resume("scene-game");
});

refs.gameRestartBtn.addEventListener("click", () => {
  refs.gameStartDiv.style.display = "none";
  refs.gameEndDiv.style.display = "none";
  game.destroy();
  points = 0;
  const newGame = new Phaser.Game(config);
});
