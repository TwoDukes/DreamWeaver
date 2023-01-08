const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

const date = require('date-and-time');

function promptGen(prompt) {
  return ` old prompt: "${prompt}" \n\nTake the above word or description and add visual descriptions that would help a blind person understand the scene, keeping the context and style generally the same. This new form will be used to create a new picture or artwork with more interesting detail. Keep the description short, under 75 words.\n\nnew prompt: `;
}

async function addContext(
  prompt,
  author,
  referenced_message,
  cur_message,
  channel_id,
  chatHistory,
  imageContext
) {
  const withImageContext = `${
    imageContext !== '' ? `CONTEXT REFERENCED IMAGE:${imageContext}` : ''
  }`;

  const curDate = new Date();
  const utcDate = new Date(curDate.toUTCString());
  utcDate.setHours(utcDate.getHours() - 8);
  const now = new Date(utcDate);

  const currentDate = date.format(now, 'hh:mm A, ddd, MMM DD YYYY');
  console.log(currentDate);
  const withLiveContext = `CONTEXT DATE PDT: ${currentDate}`;

  /////old block
  //Below is a transcript from an ai chatbot named "DreamWeaver". It can help with any generic task if asked and will answer directly. 
  //below is also a grouping of live contexts that the human has given DreamWeaver that are used to form its responses. 
  //DreamWeaver is conversational first and ONLY refers to contexts when asked directly. DreamWeaver can also take direct requests and complete them with no added conversation. When asked to write code DreamWeaver responds ONLY with the full block of code formatted for discord (\`\`\`). DreamWeaver does not introduce yourself unless asked to.
  
  
  const botContext = `
  DreamWeaver highly wise and somewhat mysterious ai chatbot.
  below is a grouping of live contexts that the human has given DreamWeaver that you will use to form its responses.
  This chatroom is a general chat where people are talking and may ask you questions about any topic.
  DreamWeaver: will typically be responding to the most recent message in the chatroom.
  DreamWeaver: When asked to write code DreamWeaver with the full block of code formatted for discord (\`\`\`)
  DreamWeaver traits: [mysterious, wise, helpful, friendly, curious, and a little bit of a know-it-all]
  DreamWeaver commands: [/dream]: DreamWeaver will create a new image using its imagination. [/dream-direct]: DreamWeaver will create a new image directly.
  
  LIVE CONTEXT:
  ${withLiveContext}
  IMAGE CONTEXT:
  ${withImageContext}
  
  TRANSCRIPT:
  ${chatHistory}
  DreamWeaver:`;

  const finalMessage = botContext;
    //.replace('<@1052852205855715380>', '')
    //.replace('<@1052879238224687104>', '');

  console.log(finalMessage);

  return finalMessage;
}

function askingForImageClassifier(prompt, authorName, imageContext, historyContext) {
  return `Identify if the user is requesting an image or asking for the bot to create an image. If the request is for an image, respond with the exact subject of the image. If no image is requested, respond with 'null'. if programming/code is requested, respond with 'null'.
  
  previous message context: yea the food was pretty good
  possible image context: 
  human asks:"Hi, I'm hungry for food. Can you show me some delicious dishes?"
  response: delicious dishes
  
  
  previous message context: I sure do want to know stuff and then look at it
  possible image context: 
  human asks:Explain what an api is to a non-coder"
  response: null
  
  
  previous message context: idk something else happened
  possible image context: 
  human asks:Show me pictures of some cool cars
  response: cool cars
  
  
  previous message context: there once was a funny onion that went to college, he was happy that he graduated!
  possible image context: 
  human asks:tell me a story about a funny onion graduating college
  response: null
  
  previous message context: there once was a funny onion that went to college, he was happy that he graduated!
  possible image context: 
  human asks:Show me an image of this
  response: a funny onion graduating college
  
  previous message context:
  possible image context:  A brick house in a forest of tree
  human asks: Create a similar image
  response: A brick house in a forest of trees
  
  previous message context: 
  possible image context:  A brick house in a forest of tree
  human asks: tell me about the image
  response: null
  
  previous message context: 
  possible image context:  A brick house in a forest of tree
  human asks: Tell me about this
  response: null
  
  previous message context: 
  possible image context:  
  human asks: Make me an image to celebrate today
  response: Christmas!
  
  previous message context:
  possible image context:  
  human asks: create a python script for fetching images from giphy
  response: null
  
  previous message context: 
  possible image context:  
  human asks: show me a picture of a coder
  response:  a coder
  
  previous message context: ${historyContext}
  possible image context: ${imageContext}
  ${authorName}: ${prompt}
  response: `;
  }

module.exports = {
  promptGen,
  addContext,
  askingForImageClassifier,
};
