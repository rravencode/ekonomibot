const { db } = require('@/modules/variables.cjs');
const { randomInt } = require('@/utils/randomInt.cjs');
const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('utilscord');
const { variables } = require('@/config.cjs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('daily')
		.setDescription('Günlük ödül kullanımıdır nadir şeyler çıkabilir!'),
	/** @param {import("discord.js").ChatInputCommandInteraction} interaction  */
	async run(interaction) {
		const embedBuilder = () => createEmbed(interaction.user);

		const member = await db.get(interaction.user.id);
		if (!member) {
			await db.set(interaction.user.id, {});
		}

		/** @type {number | null} */
		const dailyStandbyTime = await db.get(`${interaction.user.id}.dailyStandbyTime`);
		console.log(variables.dailyMs - (Date.now() - dailyStandbyTime));
		if (variables.dailyMs - (Date.now() - dailyStandbyTime) > 0) {
			await interaction.reply({
				embeds: [
					embedBuilder()
						.setTitle('❌ İşlem iptal edildi')
						.setDescription('• Bu komutu kullanmak için bir kaç süre beklemelisiniz.'),
				],
			});
			return;
		}

		const pay = randomInt(10, 15);
		await db.set(`${interaction.user.id}.money`, pay);
		await db.set(`${interaction.user.id}.dailyStandbyTime`, Date.now());

		await interaction.reply({
			embeds: [
				embedBuilder()
					.setTitle('🥳 Vuhuu, günlük ödülünü aldın!')
					.setDescription(`• Başarıyla hesabınıza \` ${pay} ${variables.currency} \` aktarıldı.`),
			],
		});
		return;
	},
};