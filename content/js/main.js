function setVisibleTags(){
  var tocLinks = document.querySelectorAll("#sidebar a:link, a:visited");
   for(var i = 0; i < tocLinks.length; i++){
     if(localStorage.getItem(tocLinks[i].getAttribute("href")) != null){
       tocLinks[i].classList.add("visited");
     }
   }
}
var starcount_elem = document.getElementById("starcount");
function updateStarCounter(){
  if(localStorage.getItem("_watchers") != null){
    starcount_elem.innerHTML = localStorage.getItem("_watchers");
  }
  var request = new XMLHttpRequest();
  // horrible hack... but stargazer output is capped at 30 per request.
  request.open("GET", "https://api.github.com/search/repositories?q=nim-by-example", true);
   request.onload = function (e) {
     var searchResults = JSON.parse(request.responseText);
     var starcount = searchResults.items[0].stargazers_count;
     starcount_elem.innerHTML = starcount;
     localStorage.setItem("_watchers", starcount)
   };
   request.onerror = function (e) {
     console.error(request.statusText);
   };
   request.send(null);
}
updateStarCounter()
localStorage.setItem(window.location.pathname, true);
setVisibleTags()
