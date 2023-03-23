

function run(){
    window.onload = function (){
        const source = document.body;
        source.addEventListener("copy", (event) => {
            const selection = document.getSelection();
            event.clipboardData.setData("text/plain", selection.toString().toUpperCase());
            event.preventDefault();
            console.log("copied following value:", {
                input: selection.toString(),
                output: undefined
            })

            const nodeId = "txt2key"
            const txt2keyNode = document.getElementById(nodeId);
            const css = `position: absolute; top: 0; left: 0; margin: 20; background: rgba(255, 255, 255, 1); color: black;`
            const content = `
                    <div class="txt2key-content" style="${css}">
                        chat gpt answer for ${selection.toString()}
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
        });
    }
}
run();