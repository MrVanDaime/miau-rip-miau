require('dotenv').config();

// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');

const cron = require('node-cron');
const logger = require('./utils/logger');
const { createTable, getGif, dbConnection } = require('./data/db.js');
const token = process.env.DISCORD_TOKEN;
const channelId = process.env.CHANNEL_ID;
const targetId = process.env.TARGET_ID;

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code only once
client.once(Events.ClientReady, (readyClient) => {
	logger.info(`Goodbye leoma cat.`);

	// If not exists
	createTable();

	// cron service
	cron.schedule(
		'0 12 * * *',
		async () => {
			let foundTarget = '';

			client.guilds.cache.forEach(async (guild) => {
				try {
					const target = await guild.members.fetch(targetId);
					foundTarget = target ? `<@${targetId}>` : '';
				} catch (err) {
					foundTarget = '';
				}
			});

			const channel = client.channels.cache.get(channelId);
			if (channel) {
				const gif = await getGif();
				if (gif) channel.send(`@everyone ${foundTarget} ${gif}`);
			} else {
				logger.info(`Channel with id: ${channelId} was not found!`);
			}
		},
		{
			timezone: 'America/Sao_Paulo',
		},
	);
});

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs
		.readdirSync(commandsPath)
		.filter((file) => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);

		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			logger.info(
				`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
			);
		}
	}
}

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

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

		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({
				content: 'There was an error while executing this command!',
				flags: MessageFlags.Ephemeral,
			});
		} else {
			await interaction.reply({
				content: 'There was an error while executing this command!',
				flags: MessageFlags.Ephemeral,
			});
		}
	}
});

// Log in to discord with the client's token
client.login(token);
