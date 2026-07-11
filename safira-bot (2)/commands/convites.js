const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");
const { getTotal } = require("../utils/convitesStore");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("convites")
        .setDescription("Veja quantas pessoas você ou outro membro convidou.")
        .addUserOption(option =>
            option
                .setName("membro")
                .setDescription("Membro para verificar (deixe vazio para ver os seus)")
                .setRequired(false)
        ),

    async execute(interaction) {

        await interaction.deferReply({ ephemeral: true });

        const alvo = interaction.options.getUser("membro") || interaction.user;

        try {

            const total = getTotal(alvo.id);

            const embed = new EmbedBuilder()
                .setColor("#00E5FF")
                .setTitle("📨 Convites")
                .setThumbnail(alvo.displayAvatarURL({ dynamic: true }))
                .addFields(
                    { name: "👤 Membro",          value: `${alvo}`,       inline: true },
                    { name: "📨 Total de convites", value: `**${total}**`, inline: true }
                )
                .setFooter({ text: "SafiraSMP • Invite Tracker" })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });

        } catch (err) {
            console.error("Erro ao buscar convites:", err);
            await interaction.editReply({
                content: "❌ Não foi possível buscar os convites."
            });
        }

    }
};
