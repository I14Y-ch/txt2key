var head = document.getElementsByTagName('head')[0];
var script = document.createElement('script');
script.type = 'text/javascript';
script.onload = function() {
    run();
}
script.src = 'https://govtech2023-text2key-qtyt.vercel.app/js/txt2key-standalone.js';
head.appendChild(script);