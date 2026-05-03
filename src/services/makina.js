const { InferenceClient } = require('@huggingface/inference');
const logger = require('../utils/logger');

const hf = new InferenceClient(process.env.HF_ACCESS_TOKEN);

const getChatContext = async (message) => {
	const messages = await message.channel.messages.fetch({
		limit: 20,
	});

	let context = messages.map((msg) => {
		const role = msg.author.bot ? 'assistant' : 'user';

		return {
			role,
			content: msg.content,
		};
	});

	return context.reverse();
};

const makina = async (message) => {
	try {
		const context = await getChatContext(message);

		const response = await hf.chatCompletion({
			model: 'meta-llama/Llama-3.1-8B-Instruct',
			messages: [
				{ role: 'system', content: process.env.MAKINA_PROMPT },
				...context,
			],
			max_tokens: 100,
			temperature: 0.7,
		});

		return response.choices[0].message.content;
	} catch (err) {
		logger.error(`Makina has failed with error: ${err.message}`);
	}
};

module.exports = { makina };
