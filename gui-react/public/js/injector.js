var head = document.getElementsByTagName('head')[0];
var script = document.createElement('script');
script.type = 'text/javascript';
script.onload = function() {
    run();
}
script.src = 'http://localhost:3000/js/txt2key-standalone.js';
head.appendChild(script);