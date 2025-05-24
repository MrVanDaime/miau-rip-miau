require('dotenv').config();
const { SlashCommandBuilder } = require('discord.js');

const validUsers = process.env.USERS.split(',');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bonk')
		.setDescription('Bonk do gato')
		.addUserOption((option) =>
			option
				.setName('user')
				.setDescription('Quem vai levar bonk?')
				.setRequired(true),
		)
		.addStringOption((option) =>
			option
				.setName('reason')
				.setDescription('Últimas palavras?')
				.setRequired(true)
				.setMinLength(1)
				.setMaxLength(50),
		),
	async execute(interaction) {
		const userId = interaction.options.getUser('user').id;
		const reason = interaction.options.getString('reason');

		if (validUsers.includes(userId)) {
			return await interaction.reply({
				content: 'Não maltrate meus irmãos também 😿',
			});
		}

		let message;
		try {
			const validUser = await interaction.guild.members.fetch(userId);

			if (validUser) {
				await interaction.guild.members.ban(userId, {
					reason: `Miau: ${reason}`,
				});
				message = 'Miau Bonk Miau';
			}
		} catch (err) {
			message = 'Não sei irmão, sem permissão ou alguma coisa assim';
		}

		await interaction.reply({
			content: message,
			flags: 'Ephemeral',
		});
	},
};
