const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const gpt3 = require('../../../../API/GPT');
const DreamStudio = require('../../../../API/DreamStudio');
const MessageType = require('../../../../Schemas/Messages');
const PromptType = require('../../../../Schemas/Prompts');

prompt = context.params.event.data.options[0].value; //substring(0,230);

await lib.discord.interactions['@1.0.1'].responses.create({
  token: `${context.params.event.token}`,
  content: `Dreaming about... ${prompt}`,
});

const gptPrompt = PromptType.promptGen(prompt);
const GPT3Response = await gpt3.getGPT3Response(gptPrompt);

console.log('prompt:', GPT3Response);

const data = await DreamStudio.text2image(GPT3Response);

await lib.discord.channels['@0.3.0'].messages.create(
  MessageType.ImageWithEmbed(
    context.params.event.channel_id,
    context.params.event.member.user.id,
    null,
    GPT3Response,
    data
  )
);
