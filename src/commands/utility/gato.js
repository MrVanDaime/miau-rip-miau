require('dotenv').config();
const { SlashCommandBuilder } = require('discord.js');
const GifService = require('../../services/GifService');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gato')
		.setDescription('Adiciona url na lista de gifs')
		.addStringOption((option) =>
			option
				.setName('url')
				.setDescription('URL do gif')
				.setRequired(true)
				.setMinLength(1)
				.setMaxLength(255),
		),
	async execute(interaction) {
		const gifUrl = interaction.options.getString('url');

		await interaction.deferReply({
			flags: 'Ephemeral',
		});

		const gifExists = await GifService.gifExists(gifUrl);

		let returnMessage;
		if (!gifExists) {
			const response = await GifService.addGif(gifUrl, interaction.user.id);
			returnMessage = response ? `😿` : 'URL inválida';
		} else {
			returnMessage = 'GIF já adicionado';
		}

		await interaction.editReply({
			content: returnMessage,
		});
	},
};
