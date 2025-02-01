const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

const timezoned = () => {
	return new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
};

const customFormat = printf(({ level, message }) => {
	return JSON.stringify({
		timestamp: timezoned(),
		level,
		message,
	});
});

const logger = createLogger({
	format: combine(timestamp({ format: timezoned }), customFormat),
	transports: [
		new transports.File({ filename: './src/logs/error.log', level: 'error' }),
		new transports.File({ filename: './src/logs/info.log' }),
	],
});

module.exports = logger;
