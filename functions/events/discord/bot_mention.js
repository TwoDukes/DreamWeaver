const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

const gpt3 = require('../../../API/GPT');
const DreamStudio = require('../../../API/DreamStudio');
const Replicate = require('../../../API/Replicate');
const MessageType = require('../../../Schemas/Messages');
const PromptType = require('../../../Schemas/Prompts');

function formatStringForURLQuery(string) {
  // Replace all spaces with %20
  let formattedString = string.replace(/\s/g, '%20');

  // Return the formatted string
  return formattedString;
}

//console.log(context.params.event);
async function handleImagePrompt() {
  console.log(context.params.event.attachments[0].url);

  const pollingURI = await Replicate.StartCaptionInference(
    context.params.event.attachments[0].url,
    'coco'
  );
  let predictedTextJson = undefined;
  while (
    predictedTextJson === undefined ||
    predictedTextJson.status !== 'processing' ||
    predictedTextJson.status !== 'starting'
  ) {
    const prediction = await lib.http.request['@1.1.7']({
      method: 'GET',
      url: pollingURI,
      headers: {
        Authorization: `Token ${process.env.REPLICATE_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const predictionText = Buffer.from(prediction.body, 'base64').toString();
    predictedTextJson = JSON.parse(predictionText);

    if (
      predictedTextJson.status !== 'processing' &&
      predictedTextJson.status !== 'starting'
    )
      break;

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  return predictedTextJson.output;
}

/////////////////// START /////////////////////////////////////////

await lib.discord.channels['@0.3.2'].typing.create({
  channel_id: context.params.event.channel_id,
});

// const queryStringContent = formatStringForURLQuery(
  // context.params.event.content
    // .replace('<@1052852205855715380>', '')
    // .replace('<@1052879238224687104>', '').trim()
// );

// console.log(queryStringContent);

// const result = await lib.http.request['@1.1.7'].get({
  // url: `https://api.duckduckgo.com/?q=${queryStringContent}&format=json&pretty=1&no_html=1&skip_disambig=1`,
// });

// console.log('RESULT:', result.data);

let imageContext = '';

if (context.params.event.attachments[0] !== undefined) {
  imageContext = await handleImagePrompt();
}

const channelHistory = await lib.discord.channels['@0.3.2'].messages.list({
  channel_id: context.params.event.channel_id,
  before: context.params.event.referenced_message
    ? context.params.event.referenced_message.id
    : context.params.event.id,
  limit: 15,
});

const history = channelHistory
  .map((x) => `${x.author.username}: ${x.content}`)
  .reverse()
  .join('\n\n');
const historyWithPrompt = `${history}\n\n${`${context.params.event.author.username}: ${context.params.event.content}`}`;

const alteredMessage = await PromptType.addContext(
  context.params.event.content,
  context.params.event.author.username,
  context.params.event.referenced_message,
  context.params.event.id,
  context.params.event.channel_id,
  historyWithPrompt,
  imageContext
);

const imagePromptMsg = PromptType.askingForImageClassifier(
  context.params.event.content,
  context.params.event.author.username,
  imageContext,
  history
);
const imagePromptRaw = await gpt3.getGPT3Response(imagePromptMsg, 0);
const imagePrompt = imagePromptRaw.trim();

if (imagePrompt !== 'null') {
  const firstMessage = await lib.discord.channels['@0.3.0'].messages.create({
    channel_id: context.params.event.channel_id,
    content: `Sure! Imagining an image for "${imagePrompt}"`,
    message_reference: {
      message_id: context.params.event.id,
    },
  });

  const gptPrompt = PromptType.promptGen(imagePrompt);
  const generatedPrompt = await gpt3.getGPT3Response(gptPrompt);

  const data = await DreamStudio.text2image(generatedPrompt);

  lib.discord.channels['@0.3.0'].messages.destroy({
    message_id: firstMessage.id,
    channel_id: context.params.event.channel_id,
  });

  await lib.discord.channels['@0.3.0'].messages.create(
    MessageType.ImageWithEmbed(
      context.params.event.channel_id,
      context.params.event.author.id,
      context.params.event.id,
      generatedPrompt,
      data
    )
  );
  return;
}

const GPT3Response = await gpt3.getGPT3Response(alteredMessage);
console.log(GPT3Response);

await lib.discord.channels['@0.3.0'].messages.create({
  channel_id: context.params.event.channel_id,
  content: GPT3Response,
  message_reference: {
    message_id: context.params.event.id,
  },
});
