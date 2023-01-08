const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const DreamStudio = require('../../../../../API/DreamStudio');
const MessageType = require('../../../../../Schemas/Messages');
const gpt3 = require('../../../../../API/GPT');



const prompt = context.params.event.message.attachments[0].description;

const priorMessage = await lib.discord.channels['@0.3.0'].messages.create({
  channel_id: context.params.event.channel_id,
  content: `Dream of something similar... "`,
  message_reference: {
    message_id: context.params.event.message.id,
  },
});

const gptPrompt = `old prompt: "${prompt}" \n\nTake the above word or description and add visual descriptions that would help a blind person understand the scene, keeping the context and style generally the same. This new form will be used to create a new picture or artwork with more interesting detail. Keep the description short, under 75 words.\n\nnew prompt:`;
const GPT3Response = await gpt3.getGPT3Response(gptPrompt);
console.log('prompt:', GPT3Response);

const data = await DreamStudio.text2image(GPT3Response);

lib.discord.channels['@0.3.0'].messages.destroy({
  message_id: priorMessage.id,
  channel_id: context.params.event.channel_id,
});

await lib.discord.channels['@0.3.0'].messages.create(
  MessageType.ImageWithEmbed(
    context.params.event.channel_id,
    context.params.event.member.user.id,
    context.params.event.message.id,
    GPT3Response,
    data
  )
);
