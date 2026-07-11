const {
  SlashCommandBuilder,
  PermissionsBitField,
  EmbedBuilder,
} = require('discord.js');

// Canal onde a lista de impulsionadores será enviada
const CANAL_BOOSTERS_ID = '1523051232271401010';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('boosters')
    .setDescription('Mostra quem está impulsionando o servidor')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),

  async execute(interaction) {
    const guild = interaction.guild;
    await guild.members.fetch(); // garante que o cache está atualizado

    const boosters = guild.members.cache.filter((m) => m.premiumSince);

    const canal = guild.channels.cache.get(CANAL_BOOSTERS_ID);
    if (!canal) {
      return interaction.reply({
        content: '❌ Não encontrei o canal configurado para enviar a lista.',
        ephemeral: true,
      });
    }

    if (boosters.size === 0) {
      await canal.send('😢 Ninguém está impulsionando o servidor no momento.');
      return interaction.reply({ content: '✅ Enviado no canal.', ephemeral: true });
    }

    const lista = boosters.map((m) => `• <@${m.id}>`).join('\n');

    const embed = new EmbedBuilder()
      .setTitle('💜 Impulsionadores da SafiraSMP')
      .setDescription(lista)
      .setColor('#f47fff')
      .setFooter({ text: `Total de impulsos: ${guild.premiumSubscriptionCount ?? 0}` });

    await canal.send({ embeds: [embed] });
    await interaction.reply({ content: '✅ Enviado no canal.', ephemeral: true });
  },
};
