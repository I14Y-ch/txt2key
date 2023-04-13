# txt2key

Txt2key ist ein automatischer Schlüsselwort-Generator. Er extrahiert aus Beschreibungstexten die passenden Schlüsselwörter und stellt diese mehrsprachig zur Verfügung. Txt2key kann einfach an bestehende Katalog-Seiten wie I14Y.ch angebunden werden. 

Txt2key ist ein experimentelles Projekt. Entstanden ist der Dienst am [GovTech-Hackathon](https://opendata.ch/events/govtech-hackathon/) vom 23. und 24. März 2023 in Zollikofen. 

## Datengrundlagen

- [Export von Opendata.swiss](https://wortaholic.ch/div/opendataswiss_keywords_descriptions_20230307_15-33-57.zip)

## Public API

- [Text2Key Yake Backend Api](https://api20230324101937.azurewebsites.net/swagger)

## Kontakt

Bei Rückfragen: [Mathias Born](mailto:mathias.born@bfs.admin.ch)

## Live Demo

1. [https://govtech2023-text2key-qtyt.vercel.app/](https://govtech2023-text2key-qtyt.vercel.app/)
1. [https://govtech2023-text2key-qtyt-5dww4h6zn-ggcaponetto.vercel.app/](https://govtech2023-text2key-qtyt-5dww4h6zn-ggcaponetto.vercel.app/)

## Extension

```javascript
var head = document.getElementsByTagName('head')[0];
var script = document.createElement('script');
script.type = 'text/javascript';
script.onload = function() {
    run();
}
script.src = 'https://govtech2023-text2key-qtyt.vercel.app/js/txt2key-standalone.js';
head.appendChild(script);
```
