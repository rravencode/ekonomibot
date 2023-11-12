const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('Bu bir test uygulamasıdır, botun çalıştığını anlayabilirsiniz.'),
	/** @param {import("discord.js").ChatInputCommandInteraction} interaction  */
	run(interaction) {
		interaction.reply('Oley! Komutlarım aktif ve çalışıyor.');
	},
};