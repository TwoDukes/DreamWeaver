const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const DreamStudio = require('../../../../../API/DreamStudio');
const MessageType = require('../../../../../Schemas/Messages');

const prompt = context.params.event.message.attachments[0].description;
console.log(prompt);

const priorMessage = await lib.discord.channels['@0.3.0'].messages.create({
  channel_id: context.params.event.channel_id,
  content: `Redreaming... `,
  message_reference: {
    message_id: context.params.event.message.id,
  },
});

const data = await DreamStudio.text2image(prompt);

lib.discord.channels['@0.3.0'].messages.destroy({
  message_id: priorMessage.id,
  channel_id: context.params.event.channel_id,
});

await lib.discord.channels['@0.3.0'].messages.create(
  MessageType.ImageWithEmbed(
    context.params.event.channel_id,
    context.params.event.member.user.id,
    context.params.event.message.id,
    prompt,
    data
  )
);
