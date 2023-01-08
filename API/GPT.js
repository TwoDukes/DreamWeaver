const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

const {Configuration, OpenAIApi} = require('openai');
const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);

async function getGPT3Response(prompt, temperature = 0.75) {
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: prompt,
    temperature: temperature,
    max_tokens: 512,
    top_p: 1,
    frequency_penalty: 0.25,
    presence_penalty: 0.35
  });
  return response.data.choices[0].text;
}

module.exports = {
  getGPT3Response,
};
