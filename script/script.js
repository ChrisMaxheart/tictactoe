let side=3;

$(".gamearea").css("grid-template-rows", "repeat("+side+",1fr");
$(".gamearea").css("grid-template-columns", "repeat("+side+",1fr");

let board=new Object();

for (let i=0; i<side*side; i++) {
  let myButton=$("<button></button>");
  myButton.attr("id", "myButton"+i);
  $(".gamearea").append(myButton);
  board["myButton"+i]=0;
}

board.checkWhoWin=function() {
  let num=0;

  while(num<9) {    
    if (this["myButton"+num]==this["myButton"+(num+1)] && this["myButton"+num]==this["myButton"+(num+2)]) {
      // console.log("test1");
      return this["myButton"+num];
    } 
    num+=3;
  }
  num=0;
  while (num<3) {
    if (this["myButton"+num]==this["myButton"+(num+3)] && this["myButton"+num]==this["myButton"+(num+6)]) {
      return this["myButton"+num];
    } 
    num+=1;
  }
  if (this["myButton"+0]==this["myButton"+4] && this["myButton"+0]==this["myButton"+8]) {
    return this["myButton"+0];
  }
  if (this["myButton"+2]==this["myButton"+4] && this["myButton"+2]==this["myButton"+6]) {
    return this["myButton"+2];
  }
  return 0;
}

let finalWidth=$(".gamearea").height();
let currWidth=$(".gamearea").width();

if (currWidth > finalWidth) {
  $(".gamearea").css("margin-left", 0.5*(currWidth-finalWidth));
  $(".gamearea").css("margin-right", 0.5*(currWidth-finalWidth));
} else {
  $(".gamearea").css("margin-top", 0.5*(finalWidth-currWidth));
  $(".gamearea").css("margin-bottom", 0.5*(finalWidth-currWidth));
}


let player1Turn=true;

$("button").click(function() {
  if (player1Turn) {
    $(this).css("background-image", "url(img/circle.png)");
  } else {
    $(this).css("background-image", "url(img/x.jpg)");
  }
  let owned;
  if (player1Turn) {
    owned=1;
  } else {
    owned=2;
  }
  player1Turn=!player1Turn;
  board[$(this).attr("id")]=owned;
  $(this).css("background-size", Math.min($(this).innerHeight(), $(this).width())*0.9);
  $(this).attr("disabled", "disabled");

  let condition = board.checkWhoWin();
  if (condition) {
    if (condition==1) {
      alert("Player 1 Wins, you will be 'teleported' back to the main page");
    } else {
      alert("Player 2 Wins, you will be 'teleported' back to the main page");
    }
  }
  if (!player1Turn) {
    AIMove();
  }
});

function AIMove() {
  for (let i=0; i<9; i++) {
    if (!$("#myButton"+i).is(":disabled")) {
      $("#myButton"+i).trigger("click");
      break;
    }
  }
}