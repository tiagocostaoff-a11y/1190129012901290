const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionFlagsBits
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("fechar")
        .setDescription("Fecha e deleta o ticket atual.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {

        const embed = new EmbedBuilder()
            .setColor("#FF4444")
            .setTitle("🔒 Fechar Ticket")
            .setDescription("Tem certeza que deseja **fechar e deletar** este ticket?\n\nEsta ação é irreversível.")
            .setFooter({ text: "SafiraSMP • Tickets" })
            .setTimestamp();

        const botoes = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("fechar_confirmar")
                .setLabel("✅ Confirmar")
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId("fechar_cancelar")
                .setLabel("❌ Cancelar")
                .setStyle(ButtonStyle.Secondary)
        );

        await interaction.reply({
            embeds: [embed],
            components: [botoes]
        });

    }
};
