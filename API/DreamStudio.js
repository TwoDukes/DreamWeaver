const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

// lib.discord.users['@0.2.1'].me.status.update({
// activity_name: `dreams float by`,
// activity_type: 'WATCHING',
// status: 'ONLINE'
// });

async function text2image(prompt, params = undefined) {
  defaultParams = {
    text_prompts: [
      {
        text: prompt,
        weight: 1,
      },
      // {
      // text: 'bad photo',
      // weight: -1,
      // },
    ],
    width: 704,
    height: 512,
    steps: 35,
    //sampler:"K_DPMPP_2M",
    cfg_scale: 6.5,
    clip_guidance_preset: 'FAST_BLUE',
  };

  if (params === undefined) params = defaultParams;

  generation = await lib.http.request['@1.1.7']({
    method: 'POST',
    url: `https://api.stability.ai/v1alpha/generation/stable-diffusion-512-v2-1/text-to-image`,
    headers: {
      Authorization: `${process.env.DS_KEY}`,
      Accept: `image/png`,
      'Content-Type': `image/png`,
    },
    body: JSON.stringify(params),
  });

  output = generation.body;
  return Buffer.from(output, 'base64');
}

module.exports = {
  text2image,
};
