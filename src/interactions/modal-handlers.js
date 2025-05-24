const { EmbedBuilder } = require('discord.js');
const { isValidUrl } = require('../utils/validateUrl');

const handleModalInteractions = async (interaction) => {
	if (interaction.customId === 'miaaauModal') {
		const title = interaction.fields.getTextInputValue('title');
		const message = interaction.fields.getTextInputValue('message');
		const imageDescription =
			interaction.fields.getTextInputValue('imageDescription');
		let imageUrl = interaction.fields.getTextInputValue('imageUrl');

		const validUrl = await isValidUrl(imageUrl);
		imageUrl = validUrl ? imageUrl : null;

		const description = validUrl
			? `${message}\n\nAnexo: ${imageDescription}`
			: message;

		const embed = new EmbedBuilder()
			.setColor('#f10009')
			.setTitle(title)
			.setDescription(description)
			.setImage(imageUrl);

		await interaction.channel.send({
			embeds: [embed],
			withResponse: true,
		});

		return await interaction.reply({
			content: 'Miaaau criado',
			flags: 'Ephemeral',
		});
	}

	if (interaction.customId.startsWith('replyModal-')) {
		const message = interaction.fields.getTextInputValue('message');
		const messageId = interaction.customId.split('-')[1];

		const channel = interaction.channel;
		const targetMessage = await channel.messages.fetch(messageId);

		await targetMessage.reply({
			content: message,
			withResponse: true,
		});

		return await interaction.reply({
			content: 'Miauply',
			flags: 'Ephemeral',
		});
	}
};

module.exports = { handleModalInteractions };
