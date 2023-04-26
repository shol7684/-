
// const current = document.querySelector(".current");
// const difficultyCheckboxs = document.querySelectorAll("input[type=radio]");

// const sizeArr = [
//   [5,10,15],
//   [15,20,25],
//   [13,10,12],
// ]

// const SUCESS_COLOR =  'rgb(16, 158, 208)' //'#109ed0';



let level = 0;

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
// 22.4%
// const boxWidth = 275;
const r = 0.8;

const boxWidth = 430 * r;
const boxHeight = 20 * r;
const boxX =15;
const boxY = 110;

// 박스
const drawBox = ()=>{
  context.beginPath();
  context.fillStyle = '#33291d';
  context.roundRect(boxX, boxY, boxWidth, boxHeight, 3);
  context.closePath();
  context.fill();
}

drawBox();


// 난이도 감소 없음 2초

// 난이도 감소 3 2.5초


const targetSizeArr = [
  [15,18,13,13], // 감소3
  [7,9,11], // 감소2
  [3,5,7], // 난이도감소없음
]

const speed = [
  2500, // 3
  2500, // 2
  2000  // x
]

const randomSize = [];




const target = (()=>{
  const range =  0.8;
  const min = 20;
  let coordinates = [];

  return {
    createCoordinates : ()=>{
      const arr = [];
      for(i=0;i<3;i++) {
        arr.push(Math.random() * (boxWidth / 3 * range - min) +  boxWidth / 3 * i + min);
      }
      coordinates = arr;
    },

    draw : ()=>{
      context.fillStyle = '#109ed0';

      coordinates.forEach((e, i)=>{
        context.fillRect(e, boxY, randomSize[i], boxHeight);
      })
    },

    coordinates : ()=>{
      return coordinates
    },

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
      console.log("intervalID ", intervalID, "정지");
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
  
  console.log(stop);
  // spacebar
  if(e.keyCode !== 32) return;

  if(stop === true) {
    console.log("return");
    return;
  }

  stop = true;

  arrow.stop();
  const success = successCount.successCheck();

  console.log(success);

  if(success) {
    keyid = setTimeout(()=>{
      arrow.repeat();
  
      stop = false;
    },1000);
  }


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
    },

    successCheck : ()=>{
      const current = arrow.current();
      const coordinates = target.coordinates();
    
      let success = false;

      coordinates.forEach((e, i)=>{
        if(e <= current && current <= e+ randomSize[i] ) {
          randomSize[i] = 0;
          coordinates[i] = 0;
    
          drawBox();
          target.draw();
          count--;
          successCount.clear();
          successCount.draw();
          success = true;
        }
      })

      if(!success || count === 0) {
        gameover();
        return false;
       }

      return true;

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
  target.createCoordinates();
  target.draw();

  arrow.repeat();

  window.addEventListener("keydown", keydownListener);
  gameTimer.start();
}


const gameover = ()=>{
  arrow.stop();
  window.removeEventListener("keydown", keydownListener);
  gameTimer.stop();
}




const test = (()=>{
  let a = [1,2];
  console.log("test");
  return {
    a : a,
    b : ()=>{
      a++;
    },
    c : ()=>{
      console.log(a);
    }
  }

})();



console.log(test.a);


console.log(test.a);
console.log(test.a);

let cc = test.a;

console.log(cc);

cc[2]=5;

// console.log(test.a);

// context.beginPath()
// context.fillStyle = 'red'
// context.roundRect(10,10,10,10,5);
// context.closePath();
// context.fill();

// context.beginPath()
// context.fillStyle = 'green'
// context.roundRect(30,10,10,10,5);
// context.closePath();
// context.fill();




const startButton = document.querySelector(".game_start");
startButton.addEventListener("click", (e)=>{
  startButton.blur();
  arrow.reset();
  arrow.draw();

  successCount.reset();
  stop = false;
  
  document.querySelectorAll("input[type=radio]").forEach((e)=>{
    if(e.checked) {
      console.log("난이도", e.value);
      level = e.value;
      for(i=0;i<3;i++) {
        const r = Math.floor(Math.random() * targetSizeArr[e.value].length);
        randomSize[i] = targetSizeArr[e.value][r];

      }
    }
  })

  context.clearRect(boxX, boxY, boxWidth, boxHeight);
  drawBox();

  startCount.start();
  
 
 
})