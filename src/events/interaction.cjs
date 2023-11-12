module.exports = {
	category: 'interactionCreate',
	/** @param {import("discord.js").Interaction} interaction  */
	run(interaction) {
		if (!interaction.isChatInputCommand()) return;

		const client = interaction.client;
		/** @type {import("discord.js").Collection<string, any} */
		const commands = client.commands;
		const commandName = interaction.commandName;

		const command = commands.find((c) => c.data.name === commandName);
		if (command) {
			command.run(interaction);
		}
	},
};