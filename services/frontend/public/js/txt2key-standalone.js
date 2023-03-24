const api = {
    queryChatGPT: async function queryChatGPT(form = {}){
        return fetch("https://govtech-service.azurewebsites.net/keywords", {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, *cors, same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: "follow", // manual, *follow, error
            referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify({
                title: 'Swiss Standard Classification of Occupations CH-ISCO-19 v.1.2',
                description: 'The Swiss Standard Classification of Occupations CH-ISCO-19 continues to use the first four levels of the International Standard Classification of Occupations ISCO-08 and includes an additional fifth level to take account of the particularities of the labour market in Switzerland. It also contains the occupation titles attributed to each category. These occupational titles group together the occupations most often mentioned in FSO surveys, those consulted by professional and managerial associations and the official titles listed by the State Secretariat for Education, Research and Innovation (SERI). This list is updated regularly.\n\nThis new classification replaces the Swiss Standard Classification of Occupations from 2000 (SSCO2000).\n\nRoutine revisions: Possible adaptations of the 5th level (types of occupation) every 3 years (1st time Octobre 2022) to meet national needs.\nMethodology revisions: According to the periodic revisions of the International Standard Classification of Occupations ISCO (ISCO)',
                publisher: 'Federal Statistical Office',
                topics: ['Official statistics', 'Labour'],
                language: "de",
                ...form
            }), // body data type must match "Content-Type" header
        });
    },
    queryRAKE: async function queryRAKE(form = {}){
        return fetch("https://api20230324101937.azurewebsites.net/keywords", {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, *cors, same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: "follow", // manual, *follow, error
            referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify({
                "title": "Some cool title",
                "description": "Some cool description",
                "topics": [
                    "Buildings", "Energy"
                ],
                "publisher": "Mario Rossi",
                language: "de",
                ...form,
            }), // body data type must match "Content-Type" header
        });
    }
}
function run(){
    function dispatchTxt2KeyEvent(config, data){
        const nodeId = "txt2key"
        const txt2keyNode = document.getElementById(nodeId);
        const css = `position: fixed; top: ${config.css.top}; left: ${config.css.left}; bottom: ${config.css.bottom}; right: ${config.css.right}; margin: 20px; background: rgba(255, 255, 255, 1); color: black; padding: 15px; opacity: 0.85`

        const content = `
                    <div class="txt2key-content" style="${css}">
                        <h4>TXT2KEY Assistant</h4>
                        <div>
                             Rapid Key Extraction:
                            ${data.map(d => d.keyword).join(", ")}
                        </div>
                    </div>
                `
        if(txt2keyNode){
            txt2keyNode.innerHTML = content;
        } else {
            const txt2keyNode = document.createElement("div");
            txt2keyNode.id = nodeId;
            txt2keyNode.innerHTML = content
            document.body.appendChild(txt2keyNode)
        }
    }
    async function onText2KeyRequest(config, text){
        /* Query the api */
        let response = await api.queryRAKE({
            "title": text,
            "description": text,
            "topics": [],
            "publisher": text,
            language: "de",
        })
            .then(async (response) => {
                let obj = {data: await response.json(), type: "rake"}
                return obj;
            }).catch(e => {
                console.error("queryRAKE - could not fetch the keys", e);
                return e;
            })
        console.log("queryRAKE - got result", response);
        dispatchTxt2KeyEvent(config, response.data)
    }
    function execute(){
        const config = window["txt2key"] || {
            version: "0.0.1",
            css: {
                // top: 0, left: 0, bottom: "inherit", right: "inherit"
                top: "inherit", left: "inherit", bottom: 0, right: 0
            },
            modes: [
                "clipboard"
            ]
        };
        const source = document.body;
        source.addEventListener("copy", async function (event){
            const selection = document.getSelection();
            event.clipboardData.setData("text/plain", selection.toString());
            event.preventDefault();

            const output = undefined;
            console.log("copied following value:", {
                input: selection.toString(),
                output
            })
            let text = selection.toString();
            await onText2KeyRequest(config, text)
        });
    }
    window.onload = function (){
        execute()
    }
    execute();
}
run();