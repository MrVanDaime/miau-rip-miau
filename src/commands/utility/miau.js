require('dotenv').config();
const { SlashCommandBuilder } = require('discord.js');

const validUsers = process.env.USERS.split(',');

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
		// Define pessoas para uso do comando
		if (!validUsers.includes(interaction.user.id)) {
			return await interaction.reply({
				content:
					'Erro: Você precisa doar 66g de cinzas de gato para usar esse comando.',
				ephemeral: false,
			});
		}

		const message = interaction.options.getString('message');

		await interaction.channel.send(message);

		await interaction.reply({
			content: message,
			ephemeral: true,
		});
	},
};
