document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  const doodler = document.createElement('div');
  let doodlerLeftSpace = 50;
  let startPoint = 150;
  let doodlerBottomSpace = 150;
  let isGameOver = false;
  let plataformCount = 5;
  let plataforms = [];
  let upTimerId;
  let downTimerId;
  let isJumping;
  let isGoingLeft = false;
  let isGoingRight = false;
  let leftTimerId;
  let rightTimerId;

  class Plataform {
    constructor(newPlatBottom) {
      this.bottom = newPlatBottom;
      this.left = Math.random() * 315;
      this.visual = document.createElement('div');

      const visual = this.visual;
      visual.classList.add('plataform');
      visual.style.left = this.left + 'px';
      visual.style.bottom = this.bottom + 'px';
      grid.appendChild(visual);
    }
  }

  function createDoodler() {
    grid.appendChild(doodler);
    doodler.classList.add('doodler');
    doodlerLeftSpace = plataforms[0].left;
    doodler.style.left = doodlerLeftSpace + 'px';
    doodler.style.bottom = doodlerBottomSpace + 'px';
  }

  function createPlataforms() {
    for (let i = 0; i < plataformCount; i++) {
      let platGap = 600 / plataformCount;
      let newPlatBottom = 100 + i * platGap;
      let newPlataform = new Plataform(newPlatBottom);
      plataforms.push(newPlataform);
      console.log(plataforms);
    }
  }

  function movePlataforms() {
    if (doodlerBottomSpace > 200) {
      plataforms.forEach((plataform) => {
        plataform.bottom -= 4;
        let visual = plataform.visual;
        visual.style.bottom = plataform.bottom + 'px';
      });
    }
  }

  function jump() {
    clearInterval(downTimerId);
    isJumping = true;
    //console.log(isJumping, 'pulando');
    upTimerId = setInterval(function () {
      doodlerBottomSpace += 20;
      doodler.style.bottom = doodlerBottomSpace + 'px';
      if (doodlerBottomSpace >= startPoint + 350) {
        fall();
      }
    }, 30);
  }

  function fall() {
    clearInterval(upTimerId);
    isJumping = false;
    //console.log(isJumping, 'caindo');
    downTimerId = setInterval(function () {
      doodlerBottomSpace -= 5;
      doodler.style.bottom = doodlerBottomSpace + 'px';
      if (doodlerBottomSpace <= 0) {
        gameOver();
      }
      plataforms.forEach((plataform) => {
        if (
          doodlerBottomSpace >= plataform.bottom &&
          doodlerBottomSpace <= plataform.bottom + 15 &&
          doodlerLeftSpace + 60 >= plataform.left &&
          doodlerLeftSpace <= plataform.left + 85 &&
          !isJumping
        ) {
          console.log('landed');
          startPoint = doodlerBottomSpace;
          jump();
        }
      });
    });
  }

  function gameOver() {
    console.log('GAME OVER');
    isGameOver = true;
    clearInterval(upTimerId);
  }

  function control(e) {
    if (e.key === 'ArrowLeft') {
      moveLeft(); //move left
    } else if (e.key === 'ArrowRight') {
      moveRight();
    }
  }

  function moveLeft() {
    isGoingLeft = true;
    leftTimerId = setInterval(function () {
      if (doodlerLeftSpace >= 0) {
        doodlerLeftSpace -= 5;
        doodler.style.left = doodlerLeftSpace + 'px';
      } else moveRight();
    });
  }
  function moveRight() {
    isGoingRight = true;
    rightTimerId = setInterval(function () {
      if (doodlerLeftSpace <= 340) {
        doodlerLeftSpace += 5;
        doodler.style.right = doodlerLeftSpace + 'px';
      } else moveLeft();
    });
  }

  function start() {
    if (!isGameOver) {
      createPlataforms();
      createDoodler();
      setInterval(movePlataforms, 30);
      jump();
      document.addEventListener('keyup', control); //ver como funfa
    }
  }

  start();
  createPlataforms();
});
