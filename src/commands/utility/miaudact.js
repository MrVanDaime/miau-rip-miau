const {
	ContextMenuCommandBuilder,
	ApplicationCommandType,
} = require('discord.js');

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName('Miaudact')
		.setType(ApplicationCommandType.Message),
	async execute(interaction) {
		await interaction.targetMessage.delete();

		return await interaction.reply({
			content: 'Miaudact',
			flags: 'Ephemeral',
		});
	},
};
