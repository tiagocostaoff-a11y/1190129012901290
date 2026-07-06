const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits
} = require("discord.js");

const CANAL_VENDAS = "1523734460464627954";

const PRODUTOS = {
    // VIPs
    vip:           { label: "VIP",              emoji: "💠" },
    prime:         { label: "Prime",            emoji: "👑" },
    crimson:       { label: "Crimson",          emoji: "🔴" },
    amethyst:      { label: "Amethyst",         emoji: "💜" },
    // Ferramentas
    picareta:      { label: "Picareta 3x3",     emoji: "⛏️" },
    machado:       { label: "Machado Lenhador",  emoji: "🪓" },
    pa:            { label: "Pá 3x3",           emoji: "🪣" },
    // Chaves
    chave_spawner: { label: "Chave Spawner",    emoji: "🔑" },
    chave_prime:   { label: "Chave Prime",      emoji: "🗝️" },
    chave_crimson: { label: "Chave Crimson",    emoji: "🔴" },
    chave_amethyst:{ label: "Chave Amethyst",   emoji: "💜" },
    // Shards
    shards_1k:     { label: "1.000 Shards",     emoji: "💎" },
    shards_2k:     { label: "2.300 Shards",     emoji: "💎" },
    shards_6k:     { label: "6.000 Shards",     emoji: "💎" },
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName("confirmar")
        .setDescription("Confirma uma venda e encerra o ticket.")
        .addStringOption(option =>
            option
                .setName("produto")
                .setDescription("O que o cliente comprou?")
                .setRequired(true)
                .addChoices(
                    // VIPs
                    { name: "💠 VIP",              value: "vip"           },
                    { name: "👑 Prime",             value: "prime"         },
                    { name: "🔴 Crimson",           value: "crimson"       },
                    { name: "💜 Amethyst",          value: "amethyst"      },
                    // Ferramentas
                    { name: "⛏️ Picareta 3x3",      value: "picareta"      },
                    { name: "🪓 Machado Lenhador",   value: "machado"       },
                    { name: "🪣 Pá 3x3",            value: "pa"            },
                    // Chaves
                    { name: "🔑 Chave Spawner",     value: "chave_spawner" },
                    { name: "🗝️ Chave Prime",        value: "chave_prime"   },
                    { name: "🔴 Chave Crimson",     value: "chave_crimson" },
                    { name: "💜 Chave Amethyst",    value: "chave_amethyst"},
                    // Shards
                    { name: "💎 1.000 Shards",      value: "shards_1k"    },
                    { name: "💎 2.300 Shards",      value: "shards_2k"    },
                    { name: "💎 6.000 Shards",      value: "shards_6k"    }
                )
        )
        .addUserOption(option =>
            option
                .setName("comprador")
                .setDescription("O cliente que realizou a compra")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {

        const produto   = interaction.options.getString("produto");
        const comprador = interaction.options.getUser("comprador");
        const info      = PRODUTOS[produto];

        await interaction.deferReply({ ephemeral: true });

        // 1. Bloqueia o canal do ticket para o comprador
        try {
            const membro = await interaction.guild.members.fetch(comprador.id);
            await interaction.channel.permissionOverwrites.edit(membro, {
                SendMessages: false
            });
        } catch (err) {
            console.error("Erro ao bloquear canal:", err);
        }

        // 2. Envia embed no canal de vendas
        const canalVendas = interaction.guild.channels.cache.get(CANAL_VENDAS);

        if (canalVendas) {
            const embedVendas = new EmbedBuilder()
                .setColor("#00E5FF")
                .setTitle("✅ Venda Confirmada!")
                .setDescription(`A venda foi um sucesso! ${comprador} comprou **${info.emoji} ${info.label}**!`)
                .addFields(
                    { name: "✅ Quem confirmou", value: `${interaction.user}`, inline: true },
                    { name: "👤 Comprador",      value: `${comprador}`,        inline: true },
                    { name: "🛒 Produto",        value: `${info.emoji} ${info.label}`, inline: true },
                    { name: "📋 Ticket",         value: `${interaction.channel}`, inline: true }
                )
                .setFooter({ text: "SafiraSMP • Vendas" })
                .setTimestamp();

            await canalVendas.send({ embeds: [embedVendas] });
        }

        // 3. Mensagem no canal do ticket
        const embedTicket = new EmbedBuilder()
            .setColor("#00E5FF")
            .setTitle("🔒 Ticket Encerrado")
            .setDescription(`Obrigado, ${comprador}! Sua compra de **${info.emoji} ${info.label}** foi confirmada com sucesso.\n\nEste ticket foi encerrado. Se precisar de ajuda, abra um novo ticket.`)
            .addFields(
                { name: "✅ Quem confirmou", value: `${interaction.user}`, inline: true },
                { name: "👤 Comprador",      value: `${comprador}`,        inline: true }
            )
            .setFooter({ text: "SafiraSMP • Vendas" })
            .setTimestamp();

        await interaction.channel.send({ embeds: [embedTicket] });

        await interaction.editReply({
            content: `✅ Venda de **${info.emoji} ${info.label}** confirmada para ${comprador}! Canal bloqueado e aviso enviado em <#${CANAL_VENDAS}>.`
        });

    }
};
