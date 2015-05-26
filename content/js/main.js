function setVisibleTags(){
  var tocLinks = document.querySelectorAll("#sidebar a:link, a:visited");
   for(var i = 0; i < tocLinks.length; i++){
     if(localStorage.getItem(tocLinks[i].getAttribute("href")) != null){
       tocLinks[i].parentNode.classList.add("visited");
     }
   }
}

var isMobile = window.matchMedia("only screen and (max-width: 720px)").matches;
if (localStorage.getItem("openside") === null) {
  window.sidebarExpanded = !isMobile;
} else {
  window.sidebarExpanded = (localStorage.getItem("openside") === "true");
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

localStorage.setItem(window.location.pathname, true);
window.onload = function(){
  updateSidebar(true);
  setVisibleTags();
}
