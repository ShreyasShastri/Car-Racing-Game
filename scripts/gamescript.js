const gamePage = document.querySelector('.gamePage');
const startPage = document.querySelector('.startPage');
const startButton = document.querySelector('.start-button');
const score = document.querySelector('.score');
const gameArea = document.querySelector('.gameArea');
const game = document.querySelector('.game');
const grassL = document.querySelector('.grassL');
const grassR = document.querySelector('.grassR');
const timer = document.querySelector('.timer');
const overlay = document.querySelector('.overlay');
const exitComment = document.querySelector('.exit-comment');


let audio = document.createElement("audio");
audio.loop = true;
let audioSource = document.createElement("source");
audioSource.setAttribute("src","audios/gameaudio.mp3");
audioSource.setAttribute("type","audio/wav");
gamePage.appendChild(audio);
audio.appendChild(audioSource);

/* Key Pressing Logic */
document.addEventListener("keydown",pressOn);
document.addEventListener("keyup",pressOff);

startButton.addEventListener("click",start);

let player = {
    speed:5,
    start:false,
    score:0
};
  
  let keys = {
    ArrowUp:false,
    ArrowDown:false,
    ArrowRight:false,
    ArrowLeft:false
  };


function refreshPage(){
  window. location. reload();
}

function start(){
  gamePage.classList.remove('hide');
  startPage.classList.add('hide');
  player.score=0;

  let yll = document.createElement("div");
  yll.setAttribute("class","yll");
  yll.style.left = "3%";
  gameArea.appendChild(yll);
  let ylr = document.createElement("div");
  ylr.setAttribute("class","ylr");
  ylr.style.left = "94%";
  gameArea.appendChild(ylr);

  audio.play();
  
  /* To create white lines on the road*/
  for (let x=0;x<10;x++){
    let div = document.createElement("div");
    div.classList.add("line");
    div.y = x*100;
    div.style.top = (x*100) + "px";
    gameArea.appendChild(div);
  }

  gameTimer();
  /* Creating a car */ 
  
  let cardiv = document.createElement("div");
  cardiv.setAttribute("class","cardiv");
  let car = document.createElement("img");
  car.setAttribute("class","car");
  car.setAttribute("src","styles/images/mycar.png");
  gameArea.appendChild(cardiv);
  cardiv.appendChild(car);
  player.x = cardiv.offsetLeft;
  player.y = cardiv.offsetTop;
  

  /* To create enemy cars on the road*/
  for (let x=0;x<3;x++){
    let enemydiv = document.createElement("div");
    enemydiv.classList.add("enemydiv");
    let enemycar = document.createElement("img");
    enemycar.setAttribute("class","enemycar");
    enemycar.setAttribute("src","styles/images/enemycar.png");
    enemydiv.y = ((x+1)*400)*(-1);
    enemydiv.style.top = enemydiv.y + "px";
    enemydiv.style.left = Math.floor(Math.random()*70) + "px";
    gameArea.appendChild(enemydiv);
    enemydiv.appendChild(enemycar);
  }
}

function endGame(){
    player.start=false;
    audio.pause();
    const finalScore = player.score
    score.innerHTML= finalScore;
    if (finalScore <= 2000){
      exitComment.innerHTML = "<center>You are a Noob !!</center>"
      endPopup();
    }else if(finalScore > 2000 && finalScore <= 5000){
      exitComment.innerHTML = "<center>You are now Skilled !!</center>"
      endPopup();
    }
    else if(finalScore > 5000 && finalScore <= 8000){
      exitComment.innerHTML = "<center>You are Master of this game !!</center>"
      endPopup();
    }else{
      exitComment.innerHTML = "<center>You are really a Pro !!</center>"
      endPopup();
    }
}

function moveLines(){
    let lines = document.querySelectorAll(".line");
    lines.forEach(function(item){
      if(item.y >= 1000)
      {
        item.y -= 1000;
      }
      item.y += player.speed;
      item.style.top = item.y+"px";
    })
  }

  function moveEnemy(car){
    let ele = document.querySelectorAll(".enemydiv");
    ele.forEach(function(item){
      if(isCollide(car, item)){
        console.log("HIT")
        endGame();
      }
      if(item.y >= 1000)
      {
        item.y = -500;
        item.style.left = Math.floor(Math.random()*300) + "px";
      }
      item.y += (player.speed + 2);
      item.style.top = item.y+"px";
    })
  }
  
  function playGame(){
    let car = document.querySelector(".cardiv");
    
    moveLines();
    moveEnemy(car);
    let road = gameArea.getBoundingClientRect();
    if(player.start){
      if(keys.ArrowUp && player.y > (road.top - 450)){player.y -= player.speed;}
      if(keys.ArrowDown && player.y < (road.bottom - 125)){player.y += (player.speed + 2);}
      if(keys.ArrowLeft && player.x > 0){player.x -= (player.speed - 2);}
      if(keys.ArrowRight && player.x < (road.width - 55)){player.x += (player.speed - 2);}
      car.style.left = player.x + 'px';
      car.style.top = player.y + 'px';
      window.requestAnimationFrame(playGame);
      player.score++;
      score.innerText = player.score;
    } 
  }
  
  function isCollide(a,b){
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();
    return !(
      ((aRect.bottom - 4) < (bRect.top)) ||
      ((aRect.top - 3) > bRect.bottom) ||
      ((aRect.right - 3 ) < bRect.left) ||
      ((aRect.left + 3) > bRect.right)
    )
  }
  
  function pressOn(e){
    e.preventDefault();
    keys[e.key]=true;
    console.log("on",e.key);  
  }
  
  function pressOff(e){
    e.preventDefault();
    keys[e.key]=false;
    console.log("off",e.key);
  }

  function gameTimer(){
    timer.classList.remove("hide");
    const interval = 1000;
    let counter = 4;
    let intervalId = setInterval(() => {
      timer.innerText = counter - 1;
      counter -= 1;
      if(counter == 0){
        clearInterval(intervalId);
        timer.classList.add("hide");
        player.start=true;
        window.requestAnimationFrame(playGame);
      }
    }, interval); 
  }
  
  function endPopup(){
    overlay.classList.remove('hide');
  }

  function restartButton(){
    refreshPage();
  }