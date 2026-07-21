const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// ID do cargo de verificado
const CARGO_VERIFICADO_ID = '1529233117339189470';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('verificados')
    .setDescription('Mostra a lista de membros verificados no servidor'),

  async execute(interaction) {
    await interaction.deferReply();

    const cargo = interaction.guild.roles.cache.get(CARGO_VERIFICADO_ID);

    if (!cargo) {
      return interaction.editReply(
        `❌ Não encontrei o cargo de verificado (ID: ${CARGO_VERIFICADO_ID}) neste servidor.`
      );
    }

    // Garante que a lista de membros do cargo está atualizada
    await interaction.guild.members.fetch();

    const membros = cargo.members;

    const listaFormatada =
      membros.size > 0
        ? membros.map((m) => `• ${m.user.tag}`).join('\n')
        : 'Nenhum membro verificado ainda.';

    const embed = new EmbedBuilder()
      .setColor('#2ecc71')
      .setTitle('📋 Membros Verificados')
      .setDescription(
        listaFormatada.length > 4000
          ? listaFormatada.slice(0, 4000) + '\n...'
          : listaFormatada
      )
      .setFooter({ text: `Total: ${membros.size} verificado(s)` })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },
};
