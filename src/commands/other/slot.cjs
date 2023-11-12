const { variables } = require('@/config.cjs');
const { db } = require('@/modules/variables.cjs');
const { randomInt } = require('crypto');
const { SlashCommandBuilder } = require('discord.js');
const { createEmbed, Random } = require('utilscord');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('slot')
		.setDescription('Üç tane aynı meyve denk gelirse, kazanırsın!'),
	/** @param {import("discord.js").ChatInputCommandInteraction} interaction  */
	async run(interaction) {
		const embedBuilder = () => createEmbed(interaction.user);

		const fruits = [
			'🍎',
			'🍌',
			'🍋',
			'🍊',
			'🥔',
			'🍆',
			'🥕',
			'🥒',
		];
		const slotBar = new Random()
			.setArray(fruits);

		/** @type {string[]} */
		const [firstFruit, secondFruit, thirdFruit] = [slotBar.random().getElement(), slotBar.random().getElement(), slotBar.random().getElement()];
		console.log(firstFruit, secondFruit, thirdFruit);

		const finalEmbed = embedBuilder()
			.setTitle('Slot dönüyor..')
			.setDescription('• Slotun dönmesini bekleyiniz, ardından sonuçlar açıklanacaktır.');

		const message = await interaction.reply({ embeds: [finalEmbed], fetchReply: true });

		await message.edit({ content: `${firstFruit}` });
		await message.edit({ content: `${firstFruit} ${secondFruit}` });
		await message.edit({ content: `${firstFruit} ${secondFruit} ${thirdFruit}` });

		const money = randomInt(10, 20);

		if (firstFruit === secondFruit && secondFruit === thirdFruit) {
			await db.add(`${interaction.user.id}.money`, money);
			await message.edit({
				embeds: [
					finalEmbed
						.setTitle('✅ Slot başarıyla döndü')
						.setDescription(`• Tebrikler, kazandınız ödül olarak \` ${money} ${variables.currency} \` hesabınıza aktarıldı.`),
				],
			});
		}
		else {
			await message.edit({
				embeds: [
					finalEmbed
						.setTitle('✅ Slot başarıyla döndü')
						.setDescription('• Tüh, kaybettiniz.'),
				],
			});
		}
	},
};