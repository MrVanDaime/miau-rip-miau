require('dotenv').config();
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { addGif, searchGif } = require('../../data/db.js');

const validUsers = process.env.USERS.split(',');

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
		// Define canal único para uso do comando
		if (!validUsers.includes(interaction.user.id)) {
			return await interaction.reply({
				content:
					'Erro: Você precisa doar 66g de cinzas de gato para usar esse comando.',
				ephemeral: true,
			});
		}

		const gif_url = interaction.options.getString('url');

		const gifExists = await searchGif(gif_url);

		let returnMessage;
		if (!gifExists) {
			const response = await addGif(gif_url, interaction.user.id);
			returnMessage = response ? `😿` : 'URL inválida';
		} else {
			returnMessage = 'GIF já adicionado';
		}

		await interaction.reply({
			content: returnMessage,
			ephemeral: true,
		});
	},
};
