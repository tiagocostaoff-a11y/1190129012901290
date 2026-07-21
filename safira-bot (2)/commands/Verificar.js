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
      .setTitle('✅ Verifique-se no servidor')
      .setDescription(
        'Para ter acesso completo ao servidor, você precisa se verificar clicando no botão abaixo.\n\n' +
          '**Ao se verificar você terá acesso a:**\n' +
          '📢 Canais exclusivos de anúncios\n' +
          '💬 Canais de chat gerais\n' +
          '🎮 Canais de jogos e eventos\n' +
          '🎁 Benefícios e sorteios exclusivos\n' +
          '🛠️ Suporte prioritário\n\n' +
          'Clique no botão **Verificar** abaixo para começar!'
      )
      .setFooter({ text: 'Sistema de Verificação' })
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
