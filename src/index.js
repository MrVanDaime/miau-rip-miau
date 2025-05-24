require('dotenv').config();

// Require the necessary discord.js classes
const validUsers = process.env.USERS.split(',');
const { Client, Events, GatewayIntentBits } = require('discord.js');

const { gifCronJob } = require('./services/gifCronJob');
const { loadCommands } = require('./services/commandLoader');

const logger = require('./utils/logger');
const { createGifsTable } = require('./data/gifQueries.js');
const {
	createSelfbonksTable,
	createSelfbonkReasonsTable,
} = require('./data/selfbonkQueries.js');
const { createCarfigsTable } = require('./data/carfigQueries.js');
const {
	handleButtonInteractions,
} = require('./interactions/button-handlers.js');
const { handleModalInteractions } = require('./interactions/modal-handlers.js');

const token = process.env.DISCORD_TOKEN;
const targetId = process.env.TARGET_ID;

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

async function init() {
	logger.info(`Goodbye leoma cat.`);

	// If not exists
	createGifsTable();
	createSelfbonksTable();
	createSelfbonkReasonsTable();
	createCarfigsTable();

	loadCommands(client);

	// cron service
	gifCronJob(client, targetId);
}

client.on(Events.InteractionCreate, async (interaction) => {
	if (interaction.isButton()) {
		return handleButtonInteractions(interaction, validUsers, client);
	}

	if (!validUsers.includes(interaction.user.id)) {
		return await interaction.reply({
			content:
				'Você precisa doar 66g de cinzas de gato para usar esse comando.',
		});
	}

	if (interaction.isModalSubmit()) {
		return handleModalInteractions(interaction);
	}

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		logger.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		logger.error(
			`There was an error while executing this command: ${error.message}`,
		);
		try {
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({
					content: 'There was an error while executing this command!',
					flags: 'Ephemeral',
				});
			} else {
				await interaction.reply({
					content: 'There was an error while executing this command!',
					flags: 'Ephemeral',
				});
			}
		} catch (replyError) {
			// Log the reply error if the interaction is unknown or expired
			logger.error(`Failed to respond to interaction: ${replyError.message}`);
		}
	}
});

// Log in to discord with the client's token
client.login(token).then(init);
