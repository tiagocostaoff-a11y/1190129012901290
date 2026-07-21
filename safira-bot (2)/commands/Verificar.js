const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('verificar')
    .setDescription('Envia o painel de verificação do servidor'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor('#3498db')
      .setAuthor({
        name: interaction.guild.name,
        iconURL: interaction.guild.iconURL({ size: 128 }) ?? undefined,
      })
      .setTitle('✅  Verifique-se no servidor')
      .setDescription(
        'Para ter acesso completo ao servidor, você precisa se verificar clicando no botão abaixo.\n\n' +
          '━━━━━━━━━━━━━━━━━━━━\n\n' +
          '**Ao se verificar você terá acesso a:**\n\n' +
          '📢 ・ Canais exclusivos de anúncios\n\n' +
          '💬 ・ Canais de chat gerais\n\n' +
          '🎮 ・ Canais de jogos e eventos\n\n' +
          '🎁 ・ Benefícios e sorteios exclusivos\n\n' +
          '🛠️ ・ Suporte prioritário\n\n' +
          '━━━━━━━━━━━━━━━━━━━━\n\n' +
          'Clique no botão **Verificar** abaixo para começar! 👇'
      )
      .setThumbnail(interaction.guild.iconURL({ size: 256 }) ?? null)
      .setImage(interaction.guild.bannerURL({ size: 512 }) ?? null)
      .setFooter({
        text: 'Sistema de Verificação',
        iconURL: interaction.guild.iconURL({ size: 64 }) ?? undefined,
      })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('botao_verificar')
        .setLabel('Verificar')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('✅')
    );

    await interaction.reply({ embeds: [embed], components: [row] });
  },
};
