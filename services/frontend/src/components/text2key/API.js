import axios from "axios"

async function queryChatGPT(opts = {}){
    return axios({
        url: "http://localhost:3000/live-leech",
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        headers: {
            "Content-Type": "application/json"
        },
        cache: 'no-store',
        body: JSON.stringify({
            prompt: `Is ${Date.now()} grater than ${Date.now()-1000}?`,
            opts
        }), // body data type must match "Content-Type" header
    })
}

export default {
    queryChatGPT
}