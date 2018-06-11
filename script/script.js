// Auto-Design by JavaScript

let side = 3;
let board = new Object();

// this is for grid initialization
$(".gamearea").css("grid-template-rows", "repeat("+side+",1fr");
$(".gamearea").css("grid-template-columns", "repeat("+side+",1fr");


// this is for auto generated button so can be scaled to bigger tic tac toe?
for (let i = 0; i < side*side; i++) {
  let myButton = $("<button></button>");
  myButton.attr("id", "myButton"+i);
  $(".gamearea").append(myButton);
  board["myButton"+i] = 0;
}

// to determine the square size
function boxResize() {
  let finalWidth = $(".gamearea").height();
  let currWidth = $(".gamearea").width();

  if (currWidth > finalWidth) {
    $(".gamearea").css("margin-left", 0.5*(currWidth-finalWidth));
    $(".gamearea").css("margin-right", 0.5*(currWidth-finalWidth));
  } else {
    $(".gamearea").css("margin-top", 0.5*(finalWidth-currWidth));
    $(".gamearea").css("margin-bottom", 0.5*(finalWidth-currWidth));
  }
}

$(window).resize(function() {
  boxResize();
});

// Windows onload deciding whether to use AI

let AI = true;

function gameStart(choice) {
  if (choice == 1) {
    AI = false;
  } else {
    AI = true;
  }
}

window.onload = function() {
  let playerChoice = localStorage.getItem("choose");
  gameStart(playerChoice);
  boxResize();
}


// to check whether someone has won the game

board.checkWhoWin = function() {
  let num = 0;

  //horizontal
  while(num<9) {    
    if (this["myButton"+num] == this["myButton"+(num+1)] && this["myButton"+num] == this["myButton"+(num+2)] && this["myButton"+num] != 0) {
      // console.log("test1");
      return this["myButton"+num];
    } 
    num += 3;
  }
  num = 0;

  //vertical
  while (num<3) {
    if (this["myButton"+num] == this["myButton"+(num+3)] && this["myButton"+num] == this["myButton"+(num+6)] && this["myButton"+num] != 0) {
      return this["myButton"+num];
    } 
    num += 1;
  }

  //diagonal
  if (this["myButton"+0] == this["myButton"+4] && this["myButton"+0] == this["myButton"+8]&& this["myButton"+0] != 0) {
    return this["myButton"+0];
  }
  if (this["myButton"+2] == this["myButton"+4] && this["myButton"+2] == this["myButton"+6]&& this["myButton"+2] != 0) {
    return this["myButton"+2];
  }

  //full, then the game is ending with draw
  let full = true;
  for (let i = 0; i < 9; i++) {
    if (this["myButton"+i] == 0) {
      full = false;
    }
  }

  if (full) {
    return 4;
  }

  return 0;
}


// what happens after someone click the button

let player1Turn = true;

$("button").click(function() {

  //the symbol
  if (player1Turn) {
    $(this).css("background-image", "url(img/circle.png)");
  } else {
    $(this).css("background-image", "url(img/x.jpg)");
  }
  let owned;
  if (player1Turn) {
    owned = 1;
  } else {
    owned = 2;
  }

  //keep track of the virtual board inside board object
  player1Turn = !player1Turn;
  board[$(this).attr("id")] = owned;
  $(this).css("background-size", Math.min($(this).innerHeight(), $(this).width())*0.9);
  $(this).attr("disabled", "disabled");


  // determine what happen after end game
  let condition = board.checkWhoWin();
  // console.log(board);
  if (condition) {
    if (condition == 1) {
      alert("Player 1 Wins, you will be 'teleported' back to the main page");
      window.open('index.html', '_self');
    } else if (condition == 2) {
      alert("Player 2 Wins, you will be 'teleported' back to the main page");
      window.open('index.html', '_self');
    } else {
      alert("Draw! You will be 'teleported' back to the main page");
      window.open('index.html', '_self');
    }
  }

  // if there is AI and not win, AI move
  if (!player1Turn && AI && condition==0) {
    AIMove();
  }
});

// AI program

function AIMove() {
  // console.log(copyBoard.checkWhoWin());


  // score board, favours win disfavours lose (of course right)
  function boardScoring(anyBoard) {
    if (anyBoard.checkWhoWin() == 2) {
      return 1000;
    } else if (anyBoard.checkWhoWin() == 1) {
      return -1000;
    } else if (anyBoard.checkWhoWin() == 4) {
      return -10;
    } else {
      return 0;
    }
  }

  // if human move, assume human will choose the move that disfavours the AI the most, else looks for the best move
  function maxmin(turn, first, second) {
    if (turn == 2) {
      return Math.max(first, second);
    } else {
      return Math.min(first,second);
    }
  }

  // recursion
  function recursThinking(anyBoard, turn, depth) {
    if (depth == 0) {
      let answer = new Object();
      answer.score = boardScoring(anyBoard);
      return answer;
    }
    let idx = -1;
    let maxi;
    if (turn == 2) {
      maxi = -10000;
    } else {
      maxi = 10000;
    }

    // try one by one
    for (let i = 0; i < 9; i++) {
      let copyBoard = jQuery.extend({}, anyBoard);

      //for first move shortcut, if middle square is empty, grab it immediately
      if (i == 4) {
        continue;
      }
      if (copyBoard["myButton"+4] == 0) {
        idx = 4;
        break;
      }

      // try if the button is empty (not clicked yet)
      if (copyBoard["myButton"+i] == 0) {
        copyBoard["myButton"+i] = turn;
        let currScoring = boardScoring(copyBoard);

        // if the game is ending
        if (currScoring != 0) {
          maxi = maxmin(turn, maxi, currScoring);
          // console.log(maxi);
          if (maxi == currScoring) {
            idx = i;
          }
        } else {

          // if the game is not ending, take turns thinking human and AI
          let nextTurn = turn;
          if (nextTurn == 2) {
            nextTurn = 1;
          } else {
            nextTurn = 2;
          }
          let recursScoring = recursThinking(copyBoard, nextTurn, depth-1).score;
          maxi = maxmin(turn, maxi, recursScoring);
          // console.log(recursThinking(copyBoard, nextTurn, depth-1));
          // console.log(i);
          if (maxi == recursScoring) {
            idx = i;
          }
        }
      }
    }

    // answer use index and score, score for counting recursively, index for the decision
    let answer = new Object();
    // console.log(maxi);
    answer.index = idx;
    answer.score = maxi;
    return answer;
  }

  // AI trigger click!
   $("#myButton"+recursThinking(board, 2, 4).index).trigger("click");
}
