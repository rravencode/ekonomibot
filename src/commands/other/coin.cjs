const { SlashCommandBuilder } = require('discord.js');
const { db } = require('@/modules/variables.cjs');
const { createEmbed } = require('utilscord');
const { variables } = require('@/config.cjs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('coin')
		.setDescription('Hesabınızda ne kadar para var, onu öğrenebilirsiniz.'),
	/** @param {import("discord.js").ChatInputCommandInteraction} interaction  */
	async run(interaction) {
		const embedBuilder = () => createEmbed(interaction.user);

		/** @type {{ money: number }} */
		const member = await db.get(interaction.user.id);
		if (!member) {
			await db.set(interaction.user.id, { money: 1 });
		}

		await interaction.reply({
			embeds: [
				embedBuilder()
					.setTitle('✅ İşlem başarılı oldu')
					.setDescription(`• Hesabınızda \` ${member.money} ${variables.currency} \` bulunuyor.`),
			],
		});
		return;
	},
};