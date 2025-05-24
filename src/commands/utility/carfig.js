require('dotenv').config();
const { SlashCommandBuilder } = require('discord.js');

const CarfigService = require('../../services/CarfigService');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('carfig')
		.setDescription('Configuraciones miau')
		.addSubcommand((subcommand) =>
			subcommand.setName('allcarfigs').setDescription('Lista todas as carfigs'),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('setcarfig')
				.setDescription('Cria carfigs')
				.addStringOption((option) =>
					option
						.setName('carfigoption')
						.setDescription('Carfig')
						.setRequired(true)
						.addChoices(
							{ name: 'Daily Cat', value: 'dailycat' },
							{ name: 'Self Bonk', value: 'selfbonk' },
						),
				)
				.addChannelOption((option) =>
					option
						.setName('carfigchannel')
						.setDescription('Canal')
						.setRequired(true),
				),
		),
	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand();

		switch (subcommand) {
			case 'allcarfigs': {
				const carfigs = await CarfigService.getAllCarfigs(interaction.guild.id);
				let carfigsFormatted = 'Nenhuma carfig definida';

				if (carfigs.data.length > 0) {
					carfigsFormatted = carfigs.data
						.map(
							(carfig) =>
								`- Carfig: **${carfig.config}**, canal: **${carfig.value}**\n`,
						)
						.join('');
				}

				await interaction.reply({
					content: carfigsFormatted,
					flags: 'Ephemeral',
				});
				break;
			}
			case 'setcarfig': {
				const carfigOption = interaction.options.getString('carfigoption');
				const carfigChannel =
					interaction.options.getChannel('carfigchannel').id;

				await CarfigService.setCarfig(
					interaction.guild.id,
					carfigOption,
					carfigChannel,
				);

				await interaction.reply({
					content: `Carfig **${carfigOption}** configurado no canal **${carfigChannel}**`,
					flags: 'Ephemeral',
				});
				break;
			}
		}
	},
};
