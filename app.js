document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  const doodler = document.createElement('div');
  let doodlerLeftSpace = 50;
  let startPoint = 150;
  let score = 13;
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
  let mensagemTrigger = false;
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

  function showWellDoneMessage() {
    const message = document.createElement('div');
    message.classList.add('well-done-message');
    message.textContent = 'WELL DONE';
    message.style.position = 'absolute';
    message.style.top = '50%';
    message.style.left = '50%';
    message.style.transform = 'translate(-50%, -50%)';
    message.style.fontSize = '30px';
    message.style.fontWeight = 'bold';
    message.style.color = 'white';
    message.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.7)';
    message.style.opacity = '1'; // Começa com opacidade 1 (visível)
    message.style.transition = 'opacity 1s ease-out'; // Adiciona a transição de opacidade
    grid.appendChild(message);

    // Fade-out após 1 segundo
    setTimeout(() => {
      message.style.opacity = '0'; // Faz com que a mensagem desapareça
    }, 2000); // Espera 1 segundo para começar o fade-out

    // Após 2 segundos, remove a mensagem da tela
    setTimeout(() => {
      grid.removeChild(message); // Remove a mensagem da tela após o fade-out
    }, 2000); // Espera 2 segundos para garantir que a transição de opacidade esteja concluída
  }

  function changeEviroment() {
    if (score == 15) {
      grid.style.backgroundImage = 'url(/assets/seaCorals.jpg)';
    } else if (score == 17) {
      grid.style.backgroundImage = 'url(/assets/magma.jpg)';
    }
  }

  function movePlataforms() {
    if (doodlerBottomSpace > 200) {
      plataforms.forEach((plataform) => {
        plataform.bottom -= 4;
        let visual = plataform.visual;
        visual.style.bottom = plataform.bottom + 'px';

        if (plataform.bottom < 10) {
          let firstPlataform = plataforms[0].visual;
          firstPlataform.classList.remove('plataform');
          //firstPlataform.remove();
          score++;
          if (score == 15) {
            mensagemTrigger = true;
            changeEviroment();
            showWellDoneMessage();
          } else if (score == 17) {
            showWellDoneMessage();
            changeEviroment();
          }
          plataforms.shift();
          console.log(plataforms);
          let newPlataform = new Plataform(600);
          plataforms.push(newPlataform);
        }
      });
    }
  }

  function jump() {
    clearInterval(downTimerId);
    isJumping = true;
    console.log(isJumping, 'pulando');
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

    while (grid.firstChild) {
      grid.removeChild(grid.firstChild);
    }

    grid.innerHTML = `<span style="font-size: 200px; color: red; font-weight: bold;">${score}</span>`;
    document.removeEventListener('keyup', control);
    clearInterval(upTimerId);
    clearInterval(downTimerId);
    clearInterval(leftTimerId);
    clearInterval(rightTimerId);
  }

  function control(e) {
    if (e.key === 'ArrowLeft') {
      moveLeft(); //move left
    } else if (e.key === 'ArrowRight') {
      moveRight();
    } else if (e.key === 'ArrowUp') {
      moveStraight();
    }
  }

  function moveLeft() {
    if (isGoingRight) {
      clearInterval(rightTimerId);
      isGoingRight = false;
    }
    isGoingLeft = true;
    leftTimerId = setInterval(function () {
      if (doodlerLeftSpace >= 0) {
        doodlerLeftSpace -= 5;
        doodler.style.left = doodlerLeftSpace + 'px';
      } else moveRight();
    });
  }
  function moveRight() {
    if (isGoingLeft) {
      clearInterval(leftTimerId);
      isGoingLeft = false;
    }

    isGoingRight = true;
    rightTimerId = setInterval(function () {
      if (doodlerLeftSpace <= 340) {
        doodlerLeftSpace += 5;
        doodler.style.right = doodlerLeftSpace + 'px';
      } else moveLeft();
    });
  }

  function moveStraight() {
    isGoingRight = false;
    isGoingLeft = false;
    clearInterval(rightTimerId);
    clearInterval(leftTimerId);
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
});
