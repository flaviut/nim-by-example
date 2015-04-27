/*
 Hyphenator_Loader 5.0.0 - client side hyphenation for webbrowsers
  Copyright (C) 2015  Mathias Nater, Zürich (mathiasnater at gmail dot com)
  https://github.com/mnater/Hyphenator

  Released under the MIT license
  http://mnater.github.io/Hyphenator/LICENSE.txt
*/
var Hyphenator_Loader=function(d){var g,h,k,f=function(a){var b;d.document.createElementNS?b=d.document.createElementNS("http://www.w3.org/1999/xhtml",a):d.document.createElement&&(b=d.document.createElement(a));return b},q=function(a){var b,c,e=function(){void 0!==d.Hyphenator?(Hyphenator.config(a),Hyphenator.run()):d.setTimeout(function(){e()},10)};b=d.document.getElementsByTagName("head").item(0);c=f("script");c.src=k;c.type="text/javascript";b.appendChild(c);e()},r=function(){var a,b,c=[],e,n=
!0,l=d.document.getElementsByTagName("body")[0];a=f("div");a.style.MozHyphens="auto";a.style["-webkit-hyphens"]="auto";a.style["-ms-hyphens"]="auto";a.style.hyphens="auto";a.style.fontSize="12px";a.style.lineHeight="12px";a.style.wordWrap="normal";a.style.visibility="hidden";for(e in g)g.hasOwnProperty(e)&&(b=f("div"),b.style.width="5em",b.lang=e,b.style["-webkit-locale"]="'"+e+"'",b.appendChild(d.document.createTextNode(g[e])),a.appendChild(b),c.push(b));l.appendChild(a);for(b=0;b<c.length;b+=1)n=
12<c[b].offsetHeight&&n;l.removeChild(a);n||q(h)},t=function(a,b){var c,e={},d,l;c=a.document.addEventListener?"addEventListener":"attachEvent";var g=a.document.addEventListener?"removeEventListener":"detachEvent",m=a.document.addEventListener?"":"on",f=function(c){d=c||a;e[d.location.href]||l&&!d.frameElement||(l=!0,b(),e[d.location.href]=!0)},h=function(){try{a.document.documentElement.doScroll("left")}catch(b){a.setTimeout(h,1);return}f(a)},k=function(){f(a)},p=function(b){if("readystatechange"!==
b.type||"complete"===a.document.readyState)a.document[g](m+b.type,p,!1),0===a.frames.length&&f(a)};if("complete"===a.document.readyState||"interactive"===a.document.readyState)a.setTimeout(k,1);else{a.document[c](m+"DOMContentLoaded",p,!1);a.document[c](m+"readystatechange",p,!1);a[c](m+"load",k,!1);c=!1;try{c=!a.frameElement}catch(q){}a.document.documentElement.doScroll&&c&&h()}};return{init:function(a,b,c){g=a;k=b;h=c||{};t(d,r)}}}(window);
Hyphenator_Loader.init({en:"hyphenationalgorithm"},"/js/hypth.js",{useCSS3hyphenation:!0});
