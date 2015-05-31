function setVisibleTags(){
  var tocLinks = document.querySelectorAll("#sidebar a:link, a:visited");
   for(var i = 0; i < tocLinks.length; i++){
     if(localStorage.getItem(tocLinks[i].getAttribute("href")) != null){
       tocLinks[i].parentNode.classList.add("visited");
     }
   }
}

function updateSidebar(notransition) {
  if (notransition) {
    document.querySelectorAll("#sidebar")[0].classList.add("notransition");
    document.querySelectorAll("article")[0].classList.add("notransition");
  }
  localStorage.setItem("openside", window.sidebarExpanded);
  if (!window.sidebarExpanded) {
    document.querySelectorAll("#sidebar")[0].classList.add("collapsed");
    document.querySelectorAll("article")[0].classList.add("expanded");
  } else {
    document.querySelectorAll("#sidebar")[0].classList.remove("collapsed");
    document.querySelectorAll("article")[0].classList.remove("expanded");
  }
  if (notransition) {
    setTimeout(function(){
      document.querySelectorAll("#sidebar")[0].classList.remove("notransition");
      document.querySelectorAll("article")[0].classList.remove("notransition");
    }, 100);
  }
}

function sidebarClick() {
  window.sidebarExpanded = !window.sidebarExpanded;
  updateSidebar(false);
}

function getNextPrev() {
  var links = document.querySelectorAll('#sidebar a[href]');
  var nav = {prev: null, next: null};
  
  if(!document.querySelector("#sidebar a[href='"+window.location.pathname+"']")){
    nav.next = links.item(1) && links.item(1).getAttribute('href');
    return nav;
  }
  
  for(var i = 0; i < links.length; i++){
    var item = links.item(i);
    if(item && item.getAttribute('href') === window.location.pathname){
      nav.prev = links.item(i - 1) && links.item(i - 1).getAttribute('href');
      nav.next = links.item(i + 1) && links.item(i + 1).getAttribute('href');
      return nav;
    }
  }
}

function updateNextPrevButtons() {
  var nav = getNextPrev();

  var prev = document.getElementById("arrow-prev");
  var next = document.getElementById("arrow-next");

  if (nav.prev != null) { prev.classList.remove("disabled"); prev.href = nav.prev; }
  if (nav.next != null) { next.classList.remove("disabled"); next.href = nav.next; }
}


var isMobile = window.screen.width < 720;
if (localStorage.getItem("openside") === null) {
  window.sidebarExpanded = !isMobile;
} else {
  window.sidebarExpanded = (localStorage.getItem("openside") === "true");
}

localStorage.setItem(window.location.pathname, true);
window.onload = function(){
  updateSidebar(true);
  setVisibleTags();
  updateNextPrevButtons();
}
