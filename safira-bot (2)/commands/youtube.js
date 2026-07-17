const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('youtube')
    .setDescription('Cria um card de divulgação do seu canal do YouTube')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(option =>
      option
        .setName('descricao')
        .setDescription('Frase/descrição que vai aparecer no card')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('link')
        .setDescription('Link do seu canal do YouTube')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('nick')
        .setDescription('Seu nick no Minecraft (pra aparecer a cara e o NameMC)')
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply();

    const descricao = interaction.options.getString('descricao');
    const link = interaction.options.getString('link');
    const nick = interaction.options.getString('nick');

    // Valida o link do YouTube
    if (!/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//i.test(link)) {
      return interaction.editReply('❌ Manda um link válido do YouTube.');
    }

    // Busca a cara do Minecraft pelo nick direto (mc-heads.net não depende
    // da API da Mojang, então evita o erro de "falha ao carregar")
    const mcFace = `https://mc-heads.net/avatar/${encodeURIComponent(nick)}/128`;

    const embed = new EmbedBuilder()
      .setColor('#00FFFF')
      .setAuthor({
        name: interaction.member?.displayName ?? interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setDescription(`**${descricao}**`)
      .addFields(
        { name: '📺 Youtuber', value: `[Clique aqui](${link})`, inline: true },
        {
          name: '🧱 NameMC',
          value: `[${nick}](https://namemc.com/profile/${encodeURIComponent(nick)})`,
          inline: true,
        }
      )
      .setThumbnail(mcFace)
      .setFooter({ text: 'Divulgação de canal' })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('Ir para o canal')
        .setStyle(ButtonStyle.Link)
        .setURL(link)
        .setEmoji('📺'),
      new ButtonBuilder()
        .setLabel('Ver no NameMC')
        .setStyle(ButtonStyle.Link)
        .setURL(`https://namemc.com/profile/${encodeURIComponent(nick)}`)
        .setEmoji('🧱')
    );

    await interaction.editReply({ embeds: [embed], components: [row] });
  },
};
