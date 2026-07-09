const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
 
// Canal onde as punições serão postadas (o que você mandou o link)
const CANAL_PUNICOES_ID = '1523051232065749107';
 
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
        // Só quem tem permissão de Administrador no servidor consegue ver/usar o comando.
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
 
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
 
        // Busca o canal fixo de punições e manda o embed lá
        const canal = await interaction.client.channels.fetch(CANAL_PUNICOES_ID).catch(() => null);
 
        if (!canal) {
            return interaction.reply({
                content: '❌ Não consegui encontrar o canal de punições. Confere se o bot está no servidor certo e tem acesso ao canal.',
                ephemeral: true,
            });
        }
 
        await canal.send({ embeds: [embed] });
 
        await interaction.reply({
            content: `✅ Punição registrada em ${canal}.`,
            ephemeral: true,
        });
    },
};
 
