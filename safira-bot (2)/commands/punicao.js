const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
 
module.exports = {
    data: new SlashCommandBuilder()
        .setName('punicao')
        .setDescription('Registra uma punição aplicada a um jogador')
        .addStringOption(option =>
            option.setName('nick')
                .setDescription('Nick do jogador (Minecraft) que foi punido')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('motivo')
                .setDescription('Motivo da punição')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('duracao')
                .setDescription('Duração da punição (ex: 1 dia, 7 dias, Permanente)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('tipo')
                .setDescription('Tipo da punição')
                .setRequired(true)
                .addChoices(
                    { name: 'Mute', value: 'Mute' },
                    { name: 'Ban', value: 'Ban' },
                    { name: 'Kick', value: 'Kick' },
                    { name: 'Advertência', value: 'Advertência' },
                ))
        // Só quem pode usar timeout/expulsar/banir consegue rodar o comando.
        // Ajuste a permissão abaixo pro cargo de staff do seu servidor, se preferir.
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
 
    async execute(interaction) {
        const nick = interaction.options.getString('nick');
        const motivo = interaction.options.getString('motivo');
        const duracao = interaction.options.getString('duracao');
        const tipo = interaction.options.getString('tipo');
        const staff = interaction.user;
 
        const embed = new EmbedBuilder()
            .setColor(0x8e5cf7) // roxo, troque pelo hex da sua identidade visual se quiser
            .setTitle('🔨 Nova Punição — ' + tipo)
            .setThumbnail(`https://mc-heads.net/avatar/${encodeURIComponent(nick)}/128`)
            .addFields(
                { name: '👤 Jogador Punido', value: `\`${nick}\``, inline: true },
                { name: '🛡️ Staff', value: `\`${staff.username}\``, inline: true },
                { name: '🏷️ Tipo', value: `\`${tipo}\``, inline: true },
                { name: '📝 Motivo', value: motivo },
                { name: '⏱️ Duração', value: duracao },
            )
            .setFooter({ text: 'Safira SMP • Sistema de Punições' })
            .setTimestamp();
 
        await interaction.reply({ embeds: [embed] });
    },
};
 
