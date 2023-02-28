var assert = require('assert');
const path = require("path")
console.log("reading env vars from " + path.resolve(`${__dirname}/.env`));
require('dotenv').config(path.resolve(`${__dirname}/.env`))
const {Configuration, OpenAIApi} = require("openai");
describe('OpenAI', function () {
    describe('#test()', function () {
        it('Should be able to invoke the AI', async function () {
            this.timeout(5 * 1000);
            async function test(){
                const configuration = new Configuration({
                    apiKey: process.env.OPENAI_API_KEY,
                });
                const openai = new OpenAIApi(configuration);
                const response = await openai.createCompletion({
                    model: "text-davinci-003",
                    prompt: "Say this is a test",
                    temperature: 0,
                    max_tokens: 7,
                });
                return response;
            }
            let response = await test();
            assert.equal(response.data.choices[0].text, "\n\nThis is indeed a test");
        });
    });
});