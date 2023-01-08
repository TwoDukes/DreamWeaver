const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const DreamStudio = require('../../../../API/DreamStudio');
const MessageType = require('../../../../Schemas/Messages');

prompt = context.params.event.data.options[0].value; //substring(0,230);
console.log('prompt:', prompt);

await lib.discord.interactions['@1.0.1'].responses.create({
  token: `${context.params.event.token}`,
  content: `Dreaming directly of... ${prompt}`,
});

console.log(context.params.event);

const data = await DreamStudio.text2image(prompt);

await lib.discord.channels['@0.3.0'].messages.create(
  MessageType.ImageWithEmbed(
    context.params.event.channel_id,
    context.params.event.member.user.id,
    null,
    prompt,
    data
  )
);
