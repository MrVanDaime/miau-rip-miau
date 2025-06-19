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

		await interaction.deferReply({
			flags: 'Ephemeral',
		});

		await interaction.channel.send({
			content: message,
			files: attachment ? [attachment.url] : null,
		});

		await interaction.editReply({
			content: message,
		});
	},
};
