const {
	ContextMenuCommandBuilder,
	ApplicationCommandType,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
	ActionRowBuilder,
} = require('discord.js');

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName('Miauply')
		.setType(ApplicationCommandType.Message),
	async execute(interaction) {
		const messageId = interaction.targetMessage.id;

		const modal = new ModalBuilder()
			.setCustomId(`replyModal-${messageId}`)
			.setTitle('Miauply');

		const message = new TextInputBuilder()
			.setCustomId('message')
			.setLabel('Mensagem')
			.setStyle(TextInputStyle.Paragraph)
			.setMinLength(1)
			.setMaxLength(500)
			.setRequired(true);

		modal.addComponents(new ActionRowBuilder().addComponents(message));

		await interaction.showModal(modal);
	},
};
