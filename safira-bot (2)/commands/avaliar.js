const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const CANAL_AVALIACOES = "1523051232665534546";
const avaliacoesUsadas = new Set();

const ESTRELAS = {
    1: "⭐☆☆☆☆",
    2: "⭐⭐☆☆☆",
    3: "⭐⭐⭐☆☆",
    4: "⭐⭐⭐⭐☆",
    5: "⭐⭐⭐⭐⭐"
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName("avaliar")
        .setDescription("Avalie o atendimento deste ticket.")
        .addIntegerOption(option =>
            option
                .setName("nota")
                .setDescription("Sua nota de 1 a 5 estrelas")
                .setRequired(true)
                .addChoices(
                    { name: "⭐☆☆☆☆  1 estrela",   value: 1 },
                    { name: "⭐⭐☆☆☆  2 estrelas",  value: 2 },
                    { name: "⭐⭐⭐☆☆  3 estrelas",  value: 3 },
                    { name: "⭐⭐⭐⭐☆  4 estrelas",  value: 4 },
                    { name: "⭐⭐⭐⭐⭐  5 estrelas",  value: 5 }
                )
        )
        .addStringOption(option =>
            option
                .setName("comentario")
                .setDescription("Conte como foi o seu atendimento")
                .setRequired(true)
                .setMaxLength(500)
        ),
    async execute(interaction) {
        const chave = `${interaction.channelId}-${interaction.user.id}`;

        if (!interaction.channel.name.includes("・")) {
            return interaction.reply({
                content: "❌ Este comando só pode ser usado dentro de um ticket.",
                ephemeral: true
            });
        }

        if (avaliacoesUsadas.has(chave)) {
            return interaction.reply({
                content: "❌ Você já avaliou este ticket. Abra um novo ticket para avaliar novamente.",
                ephemeral: true
            });
        }

        const nota       = interaction.options.getInteger("nota");
        const comentario = interaction.options.getString("comentario");
        const estrelas   = ESTRELAS[nota];

        avaliacoesUsadas.add(chave);

        const canalAvaliacoes = interaction.guild.channels.cache.get(CANAL_AVALIACOES);

        if (canalAvaliacoes) {
            const embed = new EmbedBuilder()
                .setColor("#00E5FF")
                .setTitle("📋 Nova Avaliação de Atendimento")
                .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 256 }))
                .addFields(
                    { name: "Usuário",          value: `${interaction.user}`, inline: false },
                    { name: "Nota Atendimento", value: estrelas,               inline: false },
                    { name: "Comentário",       value: `\`\`\`${comentario}\`\`\``, inline: false }
                )
                .setFooter({ text: `Canal: #${interaction.channel.name} • ${interaction.user.username}` })
                .setTimestamp();

            await canalAvaliacoes.send({ embeds: [embed] });
        }

        await interaction.reply({
            content: "✅ Obrigado pela sua avaliação! Ela foi enviada com sucesso.",
            ephemeral: true
        });
    }
};
