
let level = 0;

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const r = 0.8; // 화면비율

const boxWidth = 430 * r;
const boxHeight = 20 * r;
const boxX =50;
const boxY = 110;

canvas.width = boxWidth + 100


const drawBox = ()=>{
  context.beginPath();
  context.fillStyle = '#33291d';
  context.roundRect(boxX, boxY, boxWidth, boxHeight, 3);
  context.closePath();
  context.fill();
}

drawBox();

const targetSizeArr = [
  [13,15,18], // 감소3
  [11,13,16], // 감소2
  [8,10,13], // 난이도감소없음
]

const speed = [
  2500, // 3
  2500, // 2
  2000  // x
]


const target = (()=>{
  const range =  0.9;
  const min = boxX + 10;
  let coordinates = [];
  let randomSize = [];

  return {
    create : ()=>{
      const arr = [];

      for(let i=0;i<3;i++) {
        const start = boxWidth / 3 * i;
        const end = boxWidth /3 * (i+1);
        const min = (start) + (boxWidth/3) * 0.1 ;
        const max = end * 0.9;
    
        arr.push(Math.random() * (max - min) + min + boxX);
      }

      coordinates = arr;


      let temp = [0,1,2];
      const size = temp.map((e, i)=>{
        const index = temp[Math.floor(Math.random() * temp.length)];
        temp = temp.filter((e,i)=>{
          return e !== index;
        })
      
        return targetSizeArr[level][index]; 
      })
      
      randomSize = size;
    },

    draw : ()=>{
      context.fillStyle = '#109ed0';

      coordinates.forEach((e, i)=>{
        context.fillRect(e, boxY, randomSize[i], boxHeight);
      })
    },

    successCheck : ()=>{
      const current = arrow.current();
      let success = false;

      coordinates.forEach((e, i)=>{
        if(e <= current && current <= e+ randomSize[i] ) {
          randomSize[i] = 0;
          coordinates[i] = 0;
    
          drawBox();
          target.draw();
          success = true;
        }
      })


      return success;
    }
  }

})();


const arrow = (()=>{
  const width = 25 ;
  const heigth = 23 ;

  const startPoint = boxX 
  const endPoint = boxX + boxWidth 
  let current = startPoint;

  let up = true;
  let intervalID;

  return {

    draw : ()=>{
      context.fillStyle = '#e48602';

      // (x, y, 길이, 높이 )
      context.clearRect(startPoint - width /2, boxY + boxHeight, endPoint+width , heigth+1);
  
      context.beginPath();
      context.moveTo(current, boxY + boxHeight + 1);
      context.lineTo(current + width/2, boxY + boxHeight + heigth);
      context.lineTo(current - width/2 , boxY + boxHeight + heigth);
      context.closePath();
      context.fill();
    },

    move : ()=>{
      if(current <= boxX) {
        up = true;
      } else if(endPoint <= current ) {
        up = false;
      }

      if(up) {
        current++;
      } else {
        current--;
      }
    },
    stop : ()=>{
      clearInterval(intervalID);
    },

    repeat : ()=>{
      arrow.stop();
      intervalID = setInterval(()=>{
        arrow.draw();
        arrow.move();
      }, speed[level] / boxWidth);
    },
    reset : ()=>{
      clearInterval(intervalID);
      current = startPoint;
      up = true;
    },

    current : ()=>{
      return current;
    }

  }

})();





let stop = false;
const keydownListener = (e)=>{
  
  // spacebar
  if(e.keyCode !== 32) return;
  if(stop) return;

  stop = true;

  arrow.stop();
  const success = target.successCheck();

  if(!success) {
    gameover();
    return;
  }

  const count = successCount.success();
  if(count === 0) {
    gameover();
    return;
  }
  

  setTimeout(()=>{
    arrow.repeat();

    stop = false;
  },1000);


}






const gameTimer = (()=> {
  const x = boxX;
  const y = boxY -1;
  const fontSize = 16;
  
  const count = 15;
  let c;
  let id;

  const draw = ()=>{
    context.textAlign = "left"
    context.font = `${fontSize}px  sans-serif`;
    context.fillStyle = 'red';
    context.clearRect(x, y-fontSize, 150, fontSize);
    context.fillText("00:"+ String(c).padStart(2,"0"), x, y);
  }
  return {
    start : ()=>{
      clearInterval(id);
      c = count;
      draw();

      id = setInterval(()=>{
        c--;
        if(c < 0 ) {
          gameTimer.stop();
          gameover();
          return;
        }

        draw();
      },1000);
    },
    stop : ()=>{
      clearTimeout(id);
    },
    reset : ()=>{
      
    }
  }
})();


const successCount = (()=>{
  const width = 10;
  const height = 13;
  const blank = 2;
  const x = boxX + boxWidth;
  const y = boxY - height - 1;

  let count = 3;
  
  return {
    reset : ()=>{
      count = 3;
      successCount.clear();
      successCount.draw();    
    },
    clear : ()=>{
      context.clearRect(x, y, -(width + blank)*3, height);
    },
    draw : ()=>{
      context.beginPath();
      context.fillStyle = 'blue';
      for(i=0;i<count;i++) {
        context.roundRect(x - i * (width + blank), y, -width, height, 10);
      }
      context.closePath();
      context.fill();
      
    },
    success : ()=>{
      count--;
      successCount.clear();
      successCount.draw();

      return count;
    },
  }

})();

successCount.draw();



const startCount = (()=>{
  const x = canvas.width / 2;
  const y = canvas.height / 2;
  const fontSize = 50;
  
  const count = 3;
  let c;
  let id;

  const draw = (text)=>{
    context.textAlign = 'center';
    context.font = `${fontSize}px  sans-serif`;
    context.fillStyle = 'red';
    clear();
    context.fillText(text, x, y);
  }
  const clear = ()=>{
    context.clearRect(0, y-fontSize, canvas.width, fontSize+ 5);
  }

  return {
    start : ()=>{
      clearInterval(id);
      c = count;
      draw(c);

      id = setInterval(()=>{
        c--;
        if(0 < c ) {
          draw(c);
        } else if(c === 0) {
          draw("start");
        } else {
          clearInterval(id);
          clear();
          gameStart();
          return;
        }

      },1000);
    },

    reset : ()=>{

    }

     }
})();



const gameStart = ()=>{
  target.create();
  target.draw();

  arrow.repeat();

  window.addEventListener("keydown", keydownListener);
  gameTimer.start();
}


const gameover = ()=>{
  arrow.stop();
  window.removeEventListener("keydown", keydownListener);
  gameTimer.stop();
  console.log("over");
}




const startButton = document.querySelector(".game_start");
startButton.addEventListener("click", (e)=>{
  startButton.blur();
  arrow.reset();
  arrow.draw();

  successCount.reset();
  stop = false;
  
  document.querySelectorAll("input[type=radio]").forEach((e)=>{
    if(e.checked) {
      level = e.value;
    }
  })

  context.clearRect(boxX, boxY, boxWidth, boxHeight);
  drawBox();

  startCount.start();
})

