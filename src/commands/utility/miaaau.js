const {
	SlashCommandBuilder,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
	ActionRowBuilder,
} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('miaaau')
		.setDescription('Fala longa do gato'),

	async execute(interaction) {
		const modal = new ModalBuilder()
			.setCustomId('miaaauModal')
			.setTitle('Miaaau');

		const title = new TextInputBuilder()
			.setCustomId('title')
			.setLabel('Título')
			.setStyle(TextInputStyle.Short)
			.setMinLength(1)
			.setMaxLength(50)
			.setRequired(true);

		const message = new TextInputBuilder()
			.setCustomId('message')
			.setLabel('Mensagem')
			.setStyle(TextInputStyle.Paragraph)
			.setMinLength(1)
			.setMaxLength(2000)
			.setRequired(true);

		const imageDescription = new TextInputBuilder()
			.setCustomId('imageDescription')
			.setLabel('Descrição da imagem')
			.setStyle(TextInputStyle.Short)
			.setMinLength(0)
			.setMaxLength(50)
			.setRequired(false);

		const imageUrl = new TextInputBuilder()
			.setCustomId('imageUrl')
			.setLabel('Imagem')
			.setStyle(TextInputStyle.Short)
			.setMinLength(0)
			.setMaxLength(255)
			.setRequired(false);

		modal.addComponents(
			new ActionRowBuilder().addComponents(title),
			new ActionRowBuilder().addComponents(message),
			new ActionRowBuilder().addComponents(imageDescription),
			new ActionRowBuilder().addComponents(imageUrl),
		);

		await interaction.showModal(modal);
	},
};
