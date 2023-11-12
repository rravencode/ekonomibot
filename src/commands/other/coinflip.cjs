const { db } = require('@/modules/variables.cjs');
const { randomInt } = require('@/utils/randomInt.cjs');
const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('utilscord');
const { variables } = require('@/config.cjs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('coinflip')
		.setDescription('Yazı tura oynayarak paranızı ikiye katlayabilirsiniz!')
		.addNumberOption((input) => input.setName('money').setDescription('Bahis için kaç para veriyorsun?').setRequired(true)),
	/** @param {import("discord.js").ChatInputCommandInteraction} interaction  */
	async run(interaction) {
		const embedBuilder = () => createEmbed(interaction.user);

		/** @type {{ money: number }} */
		const member = await db.get(interaction.user.id);
		if (!member) {
			await db.set(interaction.user.id, { money: 1 });
		}

		const money = interaction.options.getNumber('money', true);
		if (money >= member.money) {
			await interaction.reply({
				embeds: [
					embedBuilder()
						.setTitle('❌ İşlem iptal edildi')
						.setDescription('• Girmiş olduğunuz bahis paranızın çok üstünde'),
				],
			});
			return;
		}

		const coinFliptResult = randomInt(1, 3);

		if (coinFliptResult === 1) {
			await db.add(`${interaction.user.id}.money`, money * 2);
			await interaction.reply({
				embeds: [
					embedBuilder()
						.setTitle('🎉 Tura geldi, kazandın!')
						.setDescription(`• Başarıyla hesabınıza \` ${money * 2} ${variables.currency} \` aktarıldı.`),
				],
			});
			return;
		}
		else {
			await db.sub(`${interaction.user.id}.money`, money);
			await interaction.reply({
				embeds: [
					embedBuilder()
						.setTitle('❌ Yazı geldi, kaybettin!')
						.setDescription(`• Hesabınızdan \` ${money} ${variables.currency} \` alındı.`),
				],
			});
			return;
		}
	},
};