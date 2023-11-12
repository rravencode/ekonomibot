const { console } = require('sneaks');

module.exports = {
	category: 'ready',
	/** @param {import("discord.js").Client} client  */
	async run(client) {
		console.success('Bot başarıyla Discord\'a giriş yaptı.');

		await client.application.commands.set(client.commands.map((command) => command.data));
	},
};