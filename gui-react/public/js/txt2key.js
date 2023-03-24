
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
    function dispatchPartial(config, data){
        /* Broadcast the event to the host so that the UI can be updated */
        window.dispatchEvent(
            new CustomEvent("txt2key", { detail: {
                    config, data, type: "response", complete: false
                }})
        );
    }
    function dispatchTxt2KeyEvent(config, data){
        /* Broadcast the event to the host so that the UI can be updated */
        window.dispatchEvent(
            new CustomEvent("txt2key", { detail: {
                    config, data, type: "response", complete: true
                }})
        );

        const nodeId = "txt2key"
        const txt2keyNode = document.getElementById(nodeId);
        const css = `position: absolute; top: ${config.css.top}; left: ${config.css.left}; bottom: ${config.css.bottom}; right: ${config.css.right}; margin: 20px; background: rgba(255, 255, 255, 1); color: black; padding: 15px; opacity: 0.5`

        let gpt;
        let rake;
        try {
            gpt = data.filter(d => d.type === "gpt")[0].data.keywords;
        } catch (e){
            console.error("error", e);
        }
        try {
            rake = data.filter(d => d.type === "rake")[0].data;
        } catch (e){
            console.error("error", e);
        }

        if(config.modes.includes("clipboard")){
            const content = `
                    <div class="txt2key-content" style="${css}">
                        <h4>TXT2KEY Assistant</h4>
                        <div>
                             rake:
                            ${rake.map(d => d.keyword).join(", ")}
                        </div>
                        <div>
                             gpt:
                            ${gpt.map(d => d.keyword).join(", ")}
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
    }
    async function onText2KeyRequest(config, data){
        /* Query the api */
        let responses = await Promise.all([
            api.queryChatGPT(data.form)
                .then(async (response) => {
                    let obj = {data: await response.json(), type: "gpt"}
                    dispatchPartial(config, [obj])
                    return obj;
                }).catch(e => {
                console.error("queryChatGPT -could not fetch the keys", e);
                return e;
            }),
            api.queryRAKE(data.form)
                .then(async (response) => {
                    let obj = {data: await response.json(), type: "rake"}
                    dispatchPartial(config, [obj])
                    return obj;
                }).catch(e => {
                console.error("queryRAKE - could not fetch the keys", e);
                return e;
            })
        ]).then(values => values)
        console.log("txt2key request - res", {
            responses
        })
        /* Dispatch the event */
        dispatchTxt2KeyEvent(config, responses)
    }
    window.onload = function (){
        /* Get the config from the global window object */
        const config = window["txt2key"];
        console.log("txt2key plugin has been initialized with the following config:", {
            config
        })

        /* Request mode (button press) */
        if(config.modes.includes("request")){
            window.addEventListener("txt2key", async function (event){
                if(event.detail.type === "request"){
                    console.log("txt2key request", {
                        event
                    })
                    let data = event.detail.data;
                    await onText2KeyRequest(config, data)
                }
            })
        }

        /* Clipboard mode (selection) */
        if(config.modes.includes("clipboard")){
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
                let data = {
                    title: text
                };
                await onText2KeyRequest(config, data)
            });
        }
    }
}
run();