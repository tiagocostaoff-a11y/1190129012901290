const { SlashCommandBuilder } = require("discord.js");
const fs   = require("fs");
const path = require("path");
const config = require("../config.json");
const { embedVotacao, botoesVotacao } = require("../utils/sugestaoHelper");

const DATA_FILE = path.join(__dirname, "../data/sugestoes.json");

function getNextId() {
    let data = { nextId: 1 };
    try { data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8")); } catch {}
    const id = data.nextId;
    fs.writeFileSync(DATA_FILE, JSON.stringify({ ...data, nextId: id + 1 }, null, 2));
    return id;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("sugestao")
        .setDescription("Envie uma sugestão para o servidor.")
        .addStringOption(o =>
            o.setName("tipo")
             .setDescription("Onde seria implementada?")
             .setRequired(true)
             .addChoices(
                 { name: "🎮 Jogo",    value: "Jogo"    },
                 { name: "💬 Discord", value: "Discord" }
             )
        )
        .addStringOption(o =>
            o.setName("sugestao")
             .setDescription("Descreva sua sugestão")
             .setRequired(true)
             .setMaxLength(1000)
        ),

    async execute(interaction) {
        const tipo  = interaction.options.getString("tipo");
        const texto = interaction.options.getString("sugestao");
        const id    = getNextId();

        const canal = interaction.guild.channels.cache.get(config.canais.sugestoes);
        if (!canal) {
            return interaction.reply({ content: "❌ Canal de sugestões não encontrado.", ephemeral: true });
        }

        if (!interaction.client.sugestoesCache) interaction.client.sugestoesCache = new Map();

        const sug = {
            id,
            tipo,
            texto,
            autorId:  interaction.user.id,
            autorTag: interaction.user.username,
            apoio:    new Set(),
            contra:   new Set(),
            status:   "votacao",
            channelId:      canal.id,
            messageId:      null,
            staffMessageId: null,
            timestamp: Date.now()
        };

        const msg = await canal.send({
            embeds:     [embedVotacao(sug)],
            components: [botoesVotacao(sug)]
        });

        sug.messageId = msg.id;
        interaction.client.sugestoesCache.set(String(id), sug);

        return interaction.reply({
            content:   `✅ Sugestão **#${id}** enviada com sucesso em <#${canal.id}>!`,
            ephemeral: true
        });
    }
};
