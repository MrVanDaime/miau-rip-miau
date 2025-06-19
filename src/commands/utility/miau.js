require('dotenv').config();
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('miau')
		.setDescription('Fala do gato')
		.addStringOption((option) =>
			option
				.setName('message')
				.setDescription('Fala do gato')
				.setRequired(true)
				.setMinLength(1)
				.setMaxLength(255),
		)
		.addAttachmentOption((option) =>
			option.setName('file').setDescription('Filé').setRequired(false),
		),
	async execute(interaction) {
		const message = interaction.options.getString('message');
		const attachment = interaction.options.getAttachment('file');

		if (attachment) {
			await interaction.channel.send({
				content: message,
				files: [attachment.url],
			});
		} else {
			await interaction.channel.send(message);
		}

		await interaction.reply({
			content: message,
			flags: 'Ephemeral',
		});
	},
};
