import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
import express from "express"
import * as api from "./api.mjs"
import cors from "cors"
const app = express()
const port = process.env.PORT || 3000
app.use(cors())
app.use(express.json());
app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.post('/live-leech', async (req, res) => {
    let promptOptions = req.body;
    let promptResponse = await api.prompt(promptOptions);
    res.send(JSON.stringify(promptResponse.data))
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})