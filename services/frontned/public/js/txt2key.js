

function run(){
    function dispatchTxt2KeyEvent(config, data){
        /* Broadcast the event to the host so that the UI can be updated */
        window.dispatchEvent(
            new CustomEvent("txt2key", { detail: {
                    config, data
                }})
        );

        const nodeId = "txt2key"
        const txt2keyNode = document.getElementById(nodeId);
        const css = `position: absolute; top: ${config.css.top}; left: ${config.css.left}; bottom: ${config.css.bottom}; right: ${config.css.right}; margin: 20px; background: rgba(255, 255, 255, 1); color: black; padding: 15px; opacity: 0.5`
        const content = `
                    <div class="txt2key-content" style="${css}">
                        <h4>TXT2KEY Co-Pilot</h4>
                        <div>
                            chat gpt answer for ${data.toString()}
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
    window.onload = function (){
        /* Get the config from the global window object */
        const config = window["txt2key"];
        console.log("txt2key plugin has been initialized with the following config:", {
            config
        })
        window.addEventListener("txt2key", function (event){
            if(event.detail.type === "request"){
                console.log("txt2key request", {
                    event
                })
                let text = event.detail.data.text;
                /* Dispatch the event */
                dispatchTxt2KeyEvent(config, text)
            }
        })

        const source = document.body;
        source.addEventListener("copy", (event) => {
            const selection = document.getSelection();
            event.clipboardData.setData("text/plain", selection.toString());
            event.preventDefault();

            /* Perform the request to our API */
            const output = undefined;
            console.log("copied following value:", {
                input: selection.toString(),
                output
            })
            /* Dispatch the event */
            dispatchTxt2KeyEvent(config, selection)
        });
    }
}
run();