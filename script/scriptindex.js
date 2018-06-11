$("button").click(function() {
  console.log($(this).attr("id"));
  if ($(this).attr("id") == "choice1") {
    localStorage.setItem("choose", 1);
  } else {
    localStorage.setItem("choose", 2);
  }
  window.open('game.html', '_self');
});