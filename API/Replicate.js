const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

async function StartCaptionInference(imageUrl, model = 'coco') {
  const predictorInitialization = await lib.http.request['@1.1.7']({
    method: 'POST',
    url: `https://api.replicate.com/v1/predictions`,
    headers: {
      Authorization: `Token ${process.env.REPLICATE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version:
        '2e1dddc8621f72155f24cf2e0adbde548458d3cab9f00c0139eea840d0ac4746',
      input: {
        image: imageUrl,
        task: "image_captioning",
      },
    }),
  });

  const initializerText = Buffer.from(
    predictorInitialization.body,
    'base64'
  ).toString();
  const initializerJsonString = initializerText.replace(/\s/g, '');
  const initlializerTextJson = await JSON.parse(initializerJsonString);
  return initlializerTextJson.urls.get;
}

module.exports = {
  StartCaptionInference,
};
