require('dotenv').config();

const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const logger = require('./utils/logger');

const loadCommands = async () => {
	const commands = [];

	// Grab all the command folders from the commands directory you created earlier
	const foldersPath = path.join(__dirname, 'commands');
	const commandFolders = fs.readdirSync(foldersPath);

	for (const folder of commandFolders) {
		// Grab all the command files from the commands directory you created earlier
		const commandsPath = path.join(foldersPath, folder);
		const commandFiles = fs
			.readdirSync(commandsPath)
			.filter((file) => file.endsWith('.js'));
		// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);
			const command = require(filePath);
			if ('data' in command && 'execute' in command) {
				commands.push(command.data.toJSON());
			} else {
				logger.info(
					`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
				);
			}
		}
	}

	return commands;
};

const deployCommands = async (commands) => {
	const rest = new REST().setToken(process.env.DISCORD_TOKEN);

	try {
		logger.info(
			`Started refreshing ${commands.length} application (/) commands.`,
		);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationCommands(process.env.CLIENT_ID),
			{ body: commands },
		);

		logger.info(
			`Successfully reloaded ${data.length} application (/) commands.`,
		);
	} catch (error) {
		logger.error(error);
	}
};

// deploy commands
(async () => {
	const commands = await loadCommands();
	await deployCommands(commands);
})();
