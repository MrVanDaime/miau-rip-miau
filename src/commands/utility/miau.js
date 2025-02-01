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
		),
	async execute(interaction) {
		const message = interaction.options.getString('message');

		await interaction.channel.send(message);

		await interaction.reply({
			content: message,
			flags: 'Ephemeral',
		});
	},
};
