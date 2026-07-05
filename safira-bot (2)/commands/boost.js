const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const config = require("../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("boost")
        .setDescription("Mostra as vantagens de impulsionar o servidor."),

    async execute(interaction) {

const canaisPermitidos = [
    "1519043728759848990",
    "1519043715145007215"
];

if (!canaisPermitidos.includes(interaction.channelId)) {
    return interaction.reply({
        content: "❌ Este comando só pode ser usado nos canais de boost.",
        ephemeral: true
    });
}

        const embed = new EmbedBuilder()
            .setColor("#8A2BE2")
            .setAuthor({
                name: "💎 Safira SMP"
            })
            .setTitle("🚀 VANTAGENS BOOSTER")
            .setDescription(`
> Impulsione o **Safira SMP** e desbloqueie benefícios exclusivos!

━━━━━━━━━━━━━━━━━━━━━━

✨ Cargo exclusivo Booster

🎨 Cor personalizada

👀 Acesso antecipado às novidades

📷 Envie imagens no chat geral

🐎 Ignore o modo lento SEM FLOOD!!

🎫 Prioridade em tickets

💎 10% OFF na Loja

🎁 Kit semanal

━━━━━━━━━━━━━━━━━━━━━━

> 💜 Todos os benefícios permanecem ativos enquanto o boost estiver ativo.
`)
            .setFooter({
                text: "Obrigado por apoiar o Safira SMP 🩵"
            })
            .setTimestamp();

        const botoes = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("boost_loja")
                .setLabel("🛒 Loja")
                .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
                .setCustomId("boost_ticket")
                .setLabel("🎫 Ticket")
                .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
                .setCustomId("boost_site")
                .setLabel("🌐 Site")
                .setStyle(ButtonStyle.Secondary)
        );

        await interaction.reply({
            embeds: [embed],
            components: [botoes]
        });

    }
};