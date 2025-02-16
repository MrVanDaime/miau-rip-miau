require('dotenv').config();
const {
	SlashCommandBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
} = require('discord.js');

const SelfbonkService = require('../../services/SelfbonkService');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('selfbonk')
		.setDescription('Herege autosucumbirão')
		.addSubcommand((subcommand) =>
			subcommand
				.setName('createactionbox')
				.setDescription('Cria a chamada para ação')
				.addStringOption((option) =>
					option
						.setName('bordercolor')
						.setDescription('Cor da borda')
						.setRequired(true)
						.setMinLength(1)
						.setMaxLength(10),
				)
				.addStringOption((option) =>
					option
						.setName('author')
						.setDescription('Nome do autor')
						.setRequired(true)
						.setMinLength(1)
						.setMaxLength(50),
				)
				.addStringOption((option) =>
					option
						.setName('authorimage')
						.setDescription('Imagem do autor')
						.setRequired(true)
						.setMinLength(1)
						.setMaxLength(100),
				)
				.addStringOption((option) =>
					option
						.setName('title')
						.setDescription('Título principal')
						.setRequired(true)
						.setMinLength(1)
						.setMaxLength(50),
				)
				.addStringOption((option) =>
					option
						.setName('titlelink')
						.setDescription('Link do título')
						.setRequired(true)
						.setMinLength(1)
						.setMaxLength(100),
				)
				.addStringOption((option) =>
					option
						.setName('field1')
						.setDescription('Texto do campo')
						.setRequired(true)
						.setMinLength(1)
						.setMaxLength(50),
				)
				.addStringOption((option) =>
					option
						.setName('answerfield1')
						.setDescription('Resposta do campo')
						.setRequired(true)
						.setMinLength(1)
						.setMaxLength(50),
				)
				.addStringOption((option) =>
					option
						.setName('imagelink')
						.setDescription('Link da imagem principal')
						.setRequired(true)
						.setMinLength(1)
						.setMaxLength(100),
				)
				.addStringOption((option) =>
					option
						.setName('footertext')
						.setDescription('Texto do rodapé')
						.setRequired(true)
						.setMinLength(1)
						.setMaxLength(50),
				)
				.addStringOption((option) =>
					option
						.setName('buttontext')
						.setDescription('Texto do botão')
						.setRequired(true)
						.setMinLength(1)
						.setMaxLength(20),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('addreason')
				.setDescription('Adiciona uma nova mensagem de bonk')
				.addStringOption((option) =>
					option
						.setName('reason')
						.setDescription('Mensagem do bonk')
						.setRequired(true)
						.setMinLength(1)
						.setMaxLength(50),
				),
		),
	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand();

		switch (subcommand) {
			case 'createactionbox':
				const bordercolor = interaction.options.getString('bordercolor');
				const author = interaction.options.getString('author');
				const authorimage = interaction.options.getString('authorimage');
				const title = interaction.options.getString('title');
				const titlelink = interaction.options.getString('titlelink');
				const field1 = interaction.options.getString('field1');
				const answerfield1 = interaction.options.getString('answerfield1');
				const imagelink = interaction.options.getString('imagelink');
				const footertext = interaction.options.getString('footertext');
				const buttontext = interaction.options.getString('buttontext');

				const confirm = new ButtonBuilder()
					.setCustomId('confirm')
					.setLabel(buttontext)
					.setStyle(ButtonStyle.Danger);

				const row = new ActionRowBuilder().addComponents(confirm);

				const embed = new EmbedBuilder()
					.setColor(bordercolor)
					.setTitle(title)
					.setURL(titlelink)
					.setAuthor({
						name: author,
						iconURL: authorimage,
					})
					.addFields({
						name: field1,
						value: answerfield1,
					})
					.setImage(imagelink)
					.setFooter({
						text: footertext,
					});

				await interaction.channel.send({
					components: [row],
					embeds: [embed],
					withResponse: true,
				});

				await interaction.reply({
					content: 'Selfbonk criado',
					flags: 'Ephemeral',
				});
				break;
			case 'addreason':
				const reason = interaction.options.getString('reason');

				await interaction.deferReply({
					flags: 'Ephemeral',
				});

				await SelfbonkService.addReason(reason, interaction.user.id);

				await interaction.editReply({
					content: `Mensagem \"${reason}\" adicionada`,
				});
				break;
		}
	},
};
