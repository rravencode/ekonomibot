const { db } = require('@/modules/variables.cjs');
const { randomInt } = require('@/utils/randomInt.cjs');
const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const ms = require('ms');
const { createEmbed, disabledButtons } = require('utilscord');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kazıkazan')
		.setDescription('Bir kazı kazan oyunu oynayarak kazıdaki parayı alabilirsin.'),
	/** @param {import("discord.js").ChatInputCommandInteraction} interaction  */
	async run(interaction) {
		const embedBuilder = () => createEmbed(interaction.user);

		const scratchButton = new ActionRowBuilder().setComponents(
			new ButtonBuilder()
				.setCustomId('scratch')
				.setLabel('Kazı kazan (3)')
				.setEmoji({ name: '🗡' })
				.setStyle(ButtonStyle.Secondary),
		);

		const finalEmbed = embedBuilder()
			.setTitle('Kazı kazımaya ne dersin?')
			.setDescription('• Aşağıdaki butona basarak kazıyı kazamaya başlayabilirsin ama unutma süre biterse kaybedersin!');

		const message = await interaction.reply({ embeds: [finalEmbed], components: [scratchButton], fetchReply: true });
		const filter = (i) => i.message.id === message.id && i.user.id === interaction.user.id;
		const collector = message.createMessageComponentCollector({
			componentType: ComponentType.Button,
			filter,
			time: ms('60s'),
		});

		collector.once('end', async () => {
			await message.edit({
				components: [disabledButtons(scratchButton)],
			});
			return;
		});

		collector.on('collect', async (i) => {
			if (!i.isButton()) return;
			const buttonName = i.component.label.split('(')[1].slice(0, 1);

			if (Number(buttonName) - 1 !== 0) {
				scratchButton.components[0].setLabel(`Kazı kazan (${Number(buttonName) - 1})`);
				await i.update({ components: [scratchButton] });
			}
			else {
				const money = randomInt(10, 20);

				await db.add(`${interaction.user.id}.money`, money);
				await i.update({ embeds: [
					embedBuilder()
						.setTitle('Tebrikler, kazıdın!')
						.setDescription('Ödülün başarıyla hesabına aktarıldı'),
				], components: [] });
			}
		});
	},
};