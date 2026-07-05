const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

// ─── Cores por status ────────────────────────────────────────────────────────
const CORES = {
    votacao: "#FFC300",
    analise: "#3498DB",
    aceita:  "#2ECC71",
    recusada:"#E74C3C"
};

// ─── Formata data/hora relativa ───────────────────────────────────────────────
function formatTimestamp(ts) {
    const now  = new Date();
    const date = new Date(ts);
    const isToday = now.toDateString() === date.toDateString();
    const timeStr = date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    if (isToday) return `Hoje às ${timeStr}`;
    const dateStr = date.toLocaleDateString("pt-BR");
    return `${dateStr} ${timeStr}`;
}

// ─── Embed: Em Votação ────────────────────────────────────────────────────────
function embedVotacao(sug) {
    const total    = sug.apoio.size + sug.contra.size;
    const apoioPct = total > 0 ? Math.round((sug.apoio.size / total) * 100) : 0;
    const contraPct= total > 0 ? Math.round((sug.contra.size / total) * 100) : 0;

    return new EmbedBuilder()
        .setColor(CORES.votacao)
        .setTitle(`🟡 Sugestão #${sug.id} — Em votação`)
        .addFields(
            { name: "🕹️ Nick do jogador",       value: sug.autorTag,  inline: true },
            { name: "📍 Onde será implementada?", value: sug.tipo,      inline: true },
            { name: "📝 Descrição da sugestão",   value: `\`\`\`${sug.texto}\`\`\`` }
        )
        .setFooter({ text: `Sugerido por ${sug.autorTag} • Total de votos: ${total} • ${formatTimestamp(sug.timestamp)}` });
}

// ─── Botões: Em Votação ───────────────────────────────────────────────────────
function botoesVotacao(sug) {
    const total    = sug.apoio.size + sug.contra.size;
    const apoioPct = total > 0 ? Math.round((sug.apoio.size / total) * 100) : 0;
    const contraPct= total > 0 ? 100 - apoioPct : 0;

    return new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId(`sug_apoio:${sug.id}`)
            .setLabel(`✅ Apoio (${apoioPct}%)`)
            .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
            .setCustomId(`sug_contra:${sug.id}`)
            .setLabel(`❌ Contra (${contraPct}%)`)
            .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
            .setCustomId("sug_nova")
            .setLabel("Nova Sugestão")
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId(`sug_staff:${sug.id}`)
            .setLabel("🔧 Ações Staff")
            .setStyle(ButtonStyle.Secondary)
    );
}

// ─── Embed: Em Análise ────────────────────────────────────────────────────────
function embedAnalise(sug) {
    const total    = sug.apoio.size + sug.contra.size;
    const apoioPct = total > 0 ? Math.round((sug.apoio.size / total) * 100) : 0;
    const contraPct= total > 0 ? 100 - apoioPct : 0;
    const resultadoTxt = `✅ ${apoioPct}% apoio | ❌ ${contraPct}% contra (${total} votos)`;

    return new EmbedBuilder()
        .setColor(CORES.analise)
        .setTitle(`🔵 Sugestão #${sug.id} — Em análise`)
        .addFields(
            { name: "🕹️ Nick do jogador",        value: sug.autorTag, inline: true },
            { name: "📍 Onde será implementada?",  value: sug.tipo,     inline: true },
            { name: "📝 Descrição da sugestão",    value: `\`\`\`${sug.texto}\`\`\`` },
            { name: "🗳️ Resultado da votação",     value: resultadoTxt }
        )
        .setFooter({ text: `Sugerido por ${sug.autorTag} • ${formatTimestamp(sug.timestamp)}` });
}

// ─── Botões: Staff (análise) ──────────────────────────────────────────────────
function botoesStaff(sugId) {
    return new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId(`sug_recusar:${sugId}`)
            .setLabel("Recusar Sugestão")
            .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
            .setCustomId(`sug_aceitar:${sugId}`)
            .setLabel("✅ Aceitar Sugestão")
            .setStyle(ButtonStyle.Success)
    );
}

// ─── Embed: Aceita ────────────────────────────────────────────────────────────
function embedAceita(sug, staffTag) {
    const data = new Date().toLocaleDateString("pt-BR");
    return new EmbedBuilder()
        .setColor(CORES.aceita)
        .setTitle(`🟢 Sugestão #${sug.id} — Aceita`)
        .addFields(
            { name: "🕹️ Nick do jogador",        value: sug.autorTag, inline: true },
            { name: "📍 Onde será implementada?",  value: sug.tipo,     inline: true },
            { name: "📝 Descrição da sugestão",    value: `\`\`\`${sug.texto}\`\`\`` },
            { name: "✅ Aceita por",               value: `[STAFF] ${staffTag}`, inline: true },
            { name: "📅 Data",                     value: data,                  inline: true }
        )
        .setFooter({ text: `Sugerido por ${sug.autorTag} • ${formatTimestamp(sug.timestamp)}` });
}

// ─── Embed: Recusada ──────────────────────────────────────────────────────────
function embedRecusada(sug, staffTag, motivo) {
    const data = new Date().toLocaleDateString("pt-BR");
    return new EmbedBuilder()
        .setColor(CORES.recusada)
        .setTitle(`🔴 Sugestão #${sug.id} — Recusada`)
        .addFields(
            { name: "🕹️ Nick do jogador",        value: sug.autorTag, inline: true },
            { name: "📍 Onde será implementada?",  value: sug.tipo,     inline: true },
            { name: "📝 Descrição da sugestão",    value: `\`\`\`${sug.texto}\`\`\`` },
            { name: "❌ Recusada por",             value: `[STAFF] ${staffTag}`, inline: true },
            { name: "📅 Data",                     value: data,                  inline: true },
            { name: "📋 Motivo",                   value: motivo }
        )
        .setFooter({ text: `Sugerido por ${sug.autorTag} • ${formatTimestamp(sug.timestamp)}` });
}

module.exports = {
    embedVotacao, botoesVotacao,
    embedAnalise, botoesStaff,
    embedAceita, embedRecusada
};
