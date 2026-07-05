const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    AttachmentBuilder,
    PermissionFlagsBits
} = require("discord.js");

const path = require("path");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("loja")
        .setDescription("Exibe os produtos e preços da loja do SafiraSMP.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {

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

                "**🏆 Planos VIP**\n" +
                "> 💠 **VIP** — R$ 7,50\n" +
                "> 👑 **Prime** — R$ 16,99\n" +
                "> 🔴 **Crimson** — R$ 25,90\n" +
                "> 💜 **Amethyst** — R$ 45,90\n\n" +

                "━━━━━━━━━━━━━━━━━━━━━━\n\n" +

                "**⛏️ Ferramentas**\n" +
                "> 🪓 **Machado Lenhador** — R$ 17,90\n" +
                "> ⛏️ **Picareta 3x3** — R$ 19,90\n" +
                "> 🪣 **Pá 3x3** — R$ 14,90\n\n" +

                "━━━━━━━━━━━━━━━━━━━━━━\n\n" +

                "**🗝️ Chaves**\n" +
                "> 🔑 **Chave Spawner** — R$ 8,90\n" +
                "> 🗝️ **Chave Prime** — R$ 14,90\n" +
                "> 🔴 **Chave Crimson** — R$ 19,90\n" +
                "> 💜 **Chave Amethyst** — R$ 29,90\n\n" +

                "━━━━━━━━━━━━━━━━━━━━━━\n\n" +

                "**💎 Shards**\n" +
                "> 💠 **1.000 Shards** — R$ 9,90\n" +
                "> 💠 **2.300 Shards** — R$ 19,90\n" +
                "> 💠 **6.000 Shards** — R$ 39,90\n\n" +

                "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                "🌐 Acesse a loja: **https://safirasmp.netlify.app/**"
            )
            .setImage("attachment://banner.png")
            .setFooter({ text: "SafiraSMP • Os itens são entregues automaticamente após confirmação" })
            .setTimestamp();

        const botoes = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("loja_comprar")
                .setLabel("🛒  Comprar")
                .setStyle(ButtonStyle.Primary)
        );

        await interaction.reply({
            embeds: [embed],
            files: [imagem],
            components: [botoes]
        });

    }
};
