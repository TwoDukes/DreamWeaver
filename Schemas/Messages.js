function ImageWithEmbed(
  channel_id,
  author_id,
  reference_message_id,
  imagePrompt,
  data
) {
  return {
    channel_id: channel_id,
    content: `${imagePrompt} | <@${author_id}>`,
    message_reference: reference_message_id === null ? {} : {
      message_id: reference_message_id,
    },
    attachments: [
      {
        file: data,
        filename: 'wandering_thought.png',
        description: `${imagePrompt}`,
      },
    ],
    components: [
      {
        type: 1,
        components: [
          {
            style: 1,
            label: `Same Dream`,
            custom_id: `redream_button`,
            disabled: false,
            type: 2,
          },
          {
            style: 1,
            label: `Similar Dream`,
            custom_id: `reimagine_button`,
            disabled: false,
            type: 2,
          },
        ],
      },
    ],
  };
}

module.exports = {
  ImageWithEmbed,
};
