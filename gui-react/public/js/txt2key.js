

function run(){
    window.onload = function (){
        const source = document.body;
        source.addEventListener("copy", (event) => {
            const selection = document.getSelection();
            event.clipboardData.setData("text/plain", selection.toString().toUpperCase());
            event.preventDefault();
            console.log("copied following value:", selection.toString())
        });
    }
}
run();