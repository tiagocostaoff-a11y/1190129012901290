const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    AttachmentBuilder
} = require("discord.js");

const path = require("path");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("loja")
        .setDescription("Exibe os produtos e preços da loja do SafiraSMP."),

    async execute(interaction) {

        if (!interaction.channel.name.includes("・")) {
            return interaction.reply({
                content: "❌ Este comando só pode ser usado dentro de um ticket.",
                ephemeral: true
            });
        }

        const imagem = new AttachmentBuilder(
            path.join(__dirname, "..", "assets", "boasvindas.png"),
            { name: "banner.png" }
        );

        const embed = new EmbedBuilder()
            .setColor("#00E5FF")
            .setAuthor({ name: "💎 SafiraSMP • Loja Oficial" })
            .setTitle("🛒 Produtos & Preços")
            .setDescription(
                "Adquira itens exclusivos e apoie o servidor!\n" +
                "Todos os itens são entregues automaticamente após a confirmação do pagamento.\n\n" +

                "━━━━━━━━━━━━━━━━━━━━━━\n\n" +

                "**✨ Auras**\n" +
                "> 🌟 **Aura** — R$ 19,99\n\n" +

                "━━━━━━━━━━━━━━━━━━━━━━\n\n" +

                "**💰 Money**\n" +
                "> 💵 **5.000 aura** — R$ 10,00\n" +
                "> 💸 **15.00 aura** — R$ 19,99\n" +
                "> 🏦 **30.000 aura** — R$ 39,99\n\n" +

                "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                "🌐 Acesse a loja: **https://safirasmp.netlify.app/**"
            )
            .setImage("attachment://banner.png")
            .setFooter({ text: "SafiraSMP • Os itens são entregues automaticamente após confirmação" })
            .setTimestamp();

        const botoes = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("loja_comprar")
                .setLabel("🛒 Comprar")
                .setStyle(ButtonStyle.Primary)
        );

        await interaction.reply({
            embeds: [embed],
            files: [imagem],
            components: [botoes]
        });
    }
};
