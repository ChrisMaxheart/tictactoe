let side = 3;

$(".gamearea").css("grid-template-rows", "repeat("+side+",1fr");
$(".gamearea").css("grid-template-columns", "repeat("+side+",1fr");

for (let i = 0; i < side*side; i++) {
  let myButton = $("<button></button>");
  myButton.attr("id", "myButton"+i);
  $(".gamearea").append(myButton);
}

let finalWidth = $(".gamearea").height();
let currWidth = $(".gamearea").width();

if (currWidth > finalWidth) {
  $(".gamearea").css("margin-left", 0.5*(currWidth-finalWidth));
  $(".gamearea").css("margin-right", 0.5*(currWidth-finalWidth));
} else {
  $(".gamearea").css("margin-top", 0.5*(finalWidth-currWidth));
  $(".gamearea").css("margin-bottom", 0.5*(finalWidth-currWidth));
}


let player1Turn = true;

$("button").click(function() {
  if (player1Turn) {
    $(this).css("background-image", "url(img/circle.png)");
  } else {
    $(this).css("background-image", "url(img/x.jpg)");
  }
  player1Turn = !player1Turn;
  $(this).css("background-size", Math.min($(this).innerHeight(), $(this).width())*0.9);
  $(this).attr("disabled", "disabled");
});