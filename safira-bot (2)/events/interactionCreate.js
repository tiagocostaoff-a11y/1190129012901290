const {
    Events,
    EmbedBuilder,
    PermissionsBitField,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ButtonBuilder,
    ButtonStyle,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    AttachmentBuilder
} = require("discord.js");

const QRCode     = require("qrcode");
const { LOJA_ITEMS }      = require("../data/lojaItems");
const { buildPixPayload } = require("../utils/pix");
const config = require("../config.json");
const {
    embedVotacao, botoesVotacao,
    embedAnalise, botoesStaff,
    embedAceita,  embedRecusada
} = require("../utils/sugestaoHelper");

// ─── Cupons válidos ───────────────────────────────────────────────────────────
const CUPONS = {
    "VIPGRATIS20": 20 // 20% de desconto
};

// ─── Tipos de ticket ──────────────────────────────────────────────────────────
const TIPOS_TICKET = {
    ticket_compras:   { emoji: "🛒", label: "Compras"   },
    ticket_parcerias: { emoji: "💎", label: "Parcerias" },
    ticket_denuncia:  { emoji: "🚨", label: "Denúncia"  },
    ticket_suporte:   { emoji: "🖥️", label: "Suporte"   }
};

// ─── Verificação ───────────────────────────────────────────────────────────────
const PALAVRA_VERIFICACAO = "safirasmp";
const CARGO_VERIFICADO_ID = "1529233117339189470";
const CARGO_NAO_VERIFICADO_ID = "1529232839764349020";
const CARGO_MEMBRO_ID = "1523051231608701069";

// ─── Cache de compras por usuário ─────────────────────────────────────────────
// client.purchaseCache será inicializado no index.js ou lazy aqui

module.exports = {
    name: Events.InteractionCreate,

    async execute(interaction, client) {

        // Inicializa caches se necessário
        if (!client.purchaseCache)   client.purchaseCache   = new Map();
        if (!client.orderMessages)   client.orderMessages   = new Map();
        if (!client.sugestoesCache)  client.sugestoesCache  = new Map();

        // ══════════════════════════════════════════════
        // SUGESTÕES — botões dinâmicos (sug_*)
        // ══════════════════════════════════════════════
        if (interaction.isButton() && interaction.customId.startsWith("sug_")) {
            const [action, sugIdStr] = interaction.customId.split(":");
            const sugId = sugIdStr;
            const sug   = client.sugestoesCache.get(sugId);

            // ── Votar: Apoio ──────────────────────────
            if (action === "sug_apoio") {
                if (!sug) return interaction.reply({ content: "❌ Sugestão não encontrada.", ephemeral: true });
                if (sug.status !== "votacao") return interaction.reply({ content: "❌ Esta sugestão não está mais em votação.", ephemeral: true });

                if (sug.apoio.has(interaction.user.id)) {
                    sug.apoio.delete(interaction.user.id);
                } else {
                    sug.apoio.add(interaction.user.id);
                    sug.contra.delete(interaction.user.id);
                }

                const ch  = interaction.guild.channels.cache.get(sug.channelId);
                const msg = await ch?.messages.fetch(sug.messageId).catch(() => null);
                if (msg) await msg.edit({ embeds: [embedVotacao(sug)], components: [botoesVotacao(sug)] });
                return interaction.update({});
            }

            // ── Votar: Contra ─────────────────────────
            if (action === "sug_contra") {
                if (!sug) return interaction.reply({ content: "❌ Sugestão não encontrada.", ephemeral: true });
                if (sug.status !== "votacao") return interaction.reply({ content: "❌ Esta sugestão não está mais em votação.", ephemeral: true });

                if (sug.contra.has(interaction.user.id)) {
                    sug.contra.delete(interaction.user.id);
                } else {
                    sug.contra.add(interaction.user.id);
                    sug.apoio.delete(interaction.user.id);
                }

                const ch  = interaction.guild.channels.cache.get(sug.channelId);
                const msg = await ch?.messages.fetch(sug.messageId).catch(() => null);
                if (msg) await msg.edit({ embeds: [embedVotacao(sug)], components: [botoesVotacao(sug)] });
                return interaction.update({});
            }

            // ── Nova Sugestão ─────────────────────────
            if (action === "sug_nova") {
                return interaction.reply({
                    content: "💡 Use o comando `/sugestao` para enviar uma nova sugestão!",
                    ephemeral: true
                });
            }

            // ── Ações Staff ───────────────────────────
            if (action === "sug_staff") {
                if (!interaction.memberPermissions.has(PermissionsBitField.Flags.Administrator)) {
                    return interaction.reply({ content: "❌ Apenas administradores podem acessar as Ações Staff.", ephemeral: true });
                }
                if (!sug) return interaction.reply({ content: "❌ Sugestão não encontrada.", ephemeral: true });
                if (sug.status !== "votacao") return interaction.reply({ content: "❌ Esta sugestão já foi movida para análise.", ephemeral: true });

                const { ActionRowBuilder: AR, ButtonBuilder: BB, ButtonStyle: BS } = require("discord.js");
                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId(`sug_analise:${sugId}`)
                        .setLabel("🔵 Mover para Em Análise")
                        .setStyle(ButtonStyle.Primary)
                );
                return interaction.reply({ content: `**🔧 Ações Staff — Sugestão #${sugId}**\nEscolha uma ação abaixo:`, components: [row], ephemeral: true });
            }

            // ── Em Análise ────────────────────────────
            if (action === "sug_analise") {
                if (!interaction.memberPermissions.has(PermissionsBitField.Flags.Administrator)) {
                    return interaction.reply({ content: "❌ Apenas administradores podem mover sugestões.", ephemeral: true });
                }
                if (!sug) return interaction.reply({ content: "❌ Sugestão não encontrada.", ephemeral: true });

                sug.status = "analise";

                // Edita mensagem original no canal de sugestões
                const chSug = interaction.guild.channels.cache.get(sug.channelId);
                const msgSug = await chSug?.messages.fetch(sug.messageId).catch(() => null);
                if (msgSug) await msgSug.edit({ embeds: [embedAnalise(sug)], components: [] });

                // Envia no canal da staff
                const chStaff = interaction.guild.channels.cache.get(config.canais.staffSugestoes);
                if (chStaff) {
                    const msgStaff = await chStaff.send({ embeds: [embedAnalise(sug)], components: [botoesStaff(sugId)] });
                    sug.staffMessageId = msgStaff.id;
                }

                return interaction.update({ content: `✅ Sugestão #${sugId} movida para análise!`, components: [] });
            }

            // ── Aceitar ───────────────────────────────
            if (action === "sug_aceitar") {
                if (!interaction.memberPermissions.has(PermissionsBitField.Flags.Administrator)) {
                    return interaction.reply({ content: "❌ Apenas administradores podem aceitar sugestões.", ephemeral: true });
                }
                if (!sug) return interaction.reply({ content: "❌ Sugestão não encontrada.", ephemeral: true });

                sug.status = "aceita";
                const embed = embedAceita(sug, interaction.user.username);

                // Atualiza canal da staff
                await interaction.update({ embeds: [embed], components: [] });

                // Atualiza canal de sugestões
                const chSug  = interaction.guild.channels.cache.get(sug.channelId);
                const msgSug = await chSug?.messages.fetch(sug.messageId).catch(() => null);
                if (msgSug) await msgSug.edit({ embeds: [embed], components: [] });

                // Envia no canal de aceitas
                const chAceitas = interaction.guild.channels.cache.get(config.canais.sugestoesAceitas);
                if (chAceitas) await chAceitas.send({ embeds: [embed] });

                return;
            }

            // ── Recusar (abre modal) ──────────────────
            if (action === "sug_recusar") {
                if (!interaction.memberPermissions.has(PermissionsBitField.Flags.Administrator)) {
                    return interaction.reply({ content: "❌ Apenas administradores podem recusar sugestões.", ephemeral: true });
                }
                if (!sug) return interaction.reply({ content: "❌ Sugestão não encontrada.", ephemeral: true });

                const modal = new ModalBuilder()
                    .setCustomId(`sug_recusar_modal:${sugId}`)
                    .setTitle("❌ Recusar Sugestão");

                const inputMotivo = new TextInputBuilder()
                    .setCustomId("sug_motivo_input")
                    .setLabel("Motivo da recusa")
                    .setStyle(TextInputStyle.Paragraph)
                    .setPlaceholder("Ex: Alto número de votos contrários")
                    .setRequired(true)
                    .setMaxLength(500);

                modal.addComponents(new ActionRowBuilder().addComponents(inputMotivo));
                return interaction.showModal(modal);
            }

            return;
        }

        // ══════════════════════════════════════════════
        // BOTÕES
        // ══════════════════════════════════════════════
        if (interaction.isButton()) {

            switch (interaction.customId) {

                // ── Verificação ──────────────────────
                case "botao_verificar": {
                    const modal = new ModalBuilder()
                        .setCustomId("modal_verificacao")
                        .setTitle("Verificação");

                    const inputVerificacao = new TextInputBuilder()
                        .setCustomId("input_verificacao")
                        .setLabel(`Digite ${PALAVRA_VERIFICACAO.toUpperCase()} para se verificar`)
                        .setStyle(TextInputStyle.Short)
                        .setPlaceholder("Digite aqui...")
                        .setMinLength(1)
                        .setMaxLength(50)
                        .setRequired(true);

                    modal.addComponents(new ActionRowBuilder().addComponents(inputVerificacao));
                    return interaction.showModal(modal);
                }

                // ── Boost ────────────────────────────
                case "boost_loja":
                    return interaction.reply({
                        content: "🛒 **Loja Oficial do Safira SMP**\n\n🔗 https://safirasmp.netlify.app/",
                        ephemeral: true
                    });

                case "boost_ticket":
                    return interaction.reply({
                        content: "🎫 **Abra um ticket em:**\n\n<#1519768482441465866>",
                        ephemeral: true
                    });

                case "boost_site":
                    return interaction.reply({
                        content: "🌐 **Site Oficial do Safira SMP**\n\n🔗 https://safirasmp.netlify.app/",
                        ephemeral: true
                    });

                // ── Fechar ticket ────────────────────
                case "fechar_cancelar": {
                    if (!interaction.memberPermissions.has(PermissionsBitField.Flags.Administrator)) {
                        return interaction.reply({
                            content: "❌ Apenas administradores podem cancelar o fechamento do ticket.",
                            ephemeral: true
                        });
                    }
                    return interaction.update({
                        content: "❌ Fechamento cancelado.",
                        embeds: [],
                        components: []
                    });
                }

                case "fechar_confirmar": {
                    if (!interaction.memberPermissions.has(PermissionsBitField.Flags.Administrator)) {
                        return interaction.reply({
                            content: "❌ Apenas administradores podem fechar o ticket.",
                            ephemeral: true
                        });
                    }
                    await interaction.update({
                        content: "🗑️ Deletando canal em 5 segundos...",
                        embeds: [],
                        components: []
                    });
                    setTimeout(() => {
                        interaction.channel.delete().catch(console.error);
                    }, 5000);
                    return;
                }

                // ── Loja: abrir select menu ──────────
                case "loja_comprar": {
                    const opcoes = Object.entries(LOJA_ITEMS).map(([key, item]) =>
                        new StringSelectMenuOptionBuilder()
                            .setValue(key)
                            .setLabel(`${item.label}  —  R$ ${item.price.toFixed(2).replace(".", ",")}`)
                            .setEmoji(item.emoji)
                    );

                    const menu = new StringSelectMenuBuilder()
                        .setCustomId("loja_select")
                        .setPlaceholder("Escolha um item...")
                        .addOptions(opcoes);

                    const row = new ActionRowBuilder().addComponents(menu);

                    return interaction.reply({
                        content: "### 🛒 Escolha um item para comprar:",
                        components: [row]
                    });
                }

                // ── Loja: prosseguir sem cupom ───────
                case "loja_prosseguir": {
                    const cache = client.purchaseCache.get(interaction.user.id);
                    if (!cache) {
                        return interaction.update({ content: "❌ Sessão expirada. Use /loja novamente.", embeds: [], components: [] });
                    }

                    const item = LOJA_ITEMS[cache.itemKey];

                    const embedFinal = new EmbedBuilder()
                        .setColor("#00E5FF")
                        .setTitle("🛒 Resumo do Pedido")
                        .setDescription(
                            `👤 Comprador: ${interaction.user}\n` +
                            `${item.emoji} **${item.label}**\n\n` +
                            `💰 Valor: **R$ ${cache.finalPrice.toFixed(2).replace(".", ",")}**\n\n` +
                            "Escolha como deseja pagar:"
                        )
                        .setFooter({ text: "SafiraSMP • Loja" })
                        .setTimestamp();

                    const botoesProsseguir = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId("loja_confirmar")
                            .setLabel("✅  Confirmar")
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId("loja_qrcode")
                            .setLabel("📷  QR Code PIX")
                            .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                            .setCustomId("loja_pix")
                            .setLabel("💸  Copia e Cola PIX")
                            .setStyle(ButtonStyle.Secondary)
                    );

                    // Atualiza a mensagem no canal (já é pública)
                    const updated = await interaction.update({ embeds: [embedFinal], components: [botoesProsseguir], fetchReply: true });
                    client.orderMessages.set(updated.id, {
                        buyerUserId: interaction.user.id,
                        itemKey: cache.itemKey,
                        finalPrice: cache.finalPrice
                    });
                    return;
                }

                // ── Loja: adicionar cupom ────────────
                case "loja_addcupom": {
                    const modal = new ModalBuilder()
                        .setCustomId("loja_cupom_modal")
                        .setTitle("🏷️ Cupom de Desconto");

                    const input = new TextInputBuilder()
                        .setCustomId("loja_cupom_input")
                        .setLabel("Digite seu cupom")
                        .setStyle(TextInputStyle.Short)
                        .setPlaceholder("Ex: SAFIRA10")
                        .setRequired(true)
                        .setMaxLength(30);

                    modal.addComponents(new ActionRowBuilder().addComponents(input));
                    return interaction.showModal(modal);
                }

                // ── Loja: confirmar (admin) ──────────
                case "loja_confirmar": {
                    if (!interaction.memberPermissions.has(PermissionsBitField.Flags.Administrator)) {
                        return interaction.reply({
                            content: "❌ Apenas administradores podem confirmar pagamentos.",
                            ephemeral: true
                        });
                    }

                    const order = client.orderMessages.get(interaction.message.id);
                    const itemKey = order?.itemKey ?? "o_item";
                    const buyerMention = order ? `<@${order.buyerUserId}>` : "@comprador";

                    return interaction.reply({
                        content: `📋 Use o comando:\n\`/confirmar produto:${LOJA_ITEMS[itemKey]?.label ?? itemKey} comprador:${buyerMention}\``,
                        ephemeral: true
                    });
                }

                // ── Loja: QR Code PIX ────────────────
                case "loja_qrcode": {
                    await interaction.deferReply();

                    const orderQr  = client.orderMessages.get(interaction.message.id);
                    let finalPrice = orderQr?.finalPrice ?? 0;

                    const pixKey  = process.env.PIX_KEY;
                    const pixName = process.env.PIX_NAME;
                    const pixCity = process.env.PIX_CITY;

                    if (!pixKey) {
                        return interaction.editReply({
                            content: "❌ Chave PIX não configurada. Contate um administrador."
                        });
                    }

                    try {
                        const payload = buildPixPayload(pixKey, pixName, pixCity, finalPrice);
                        const qrBuffer = await QRCode.toBuffer(payload, {
                            errorCorrectionLevel: "M",
                            width: 400,
                            margin: 2,
                            color: { dark: "#000000", light: "#FFFFFF" }
                        });

                        const attachment = new AttachmentBuilder(qrBuffer, { name: "pix_qrcode.png" });

                        const embed = new EmbedBuilder()
                            .setColor("#00E5FF")
                            .setTitle("📷 QR Code PIX")
                            .setDescription(
                                `**Valor:** R$ ${finalPrice.toFixed(2).replace(".", ",")}\n\n` +
                                "📱 Escaneie o QR Code abaixo e pague.\n" +
                                "Após o pagamento, aguarde a confirmação da staff."
                            )
                            .setImage("attachment://pix_qrcode.png")
                            .setFooter({ text: "SafiraSMP • Pagamento via PIX" });

                        return interaction.editReply({ embeds: [embed], files: [attachment] });
                    } catch (err) {
                        console.error("Erro ao gerar QR Code:", err);
                        return interaction.editReply({ content: "❌ Erro ao gerar o QR Code. Tente novamente." });
                    }
                }

                // ── Loja: Copia e Cola PIX ───────────
                case "loja_pix": {
                    const pixKey  = process.env.PIX_KEY;
                    const pixName = process.env.PIX_NAME;
                    const pixCity = process.env.PIX_CITY;

                    if (!pixKey) {
                        return interaction.reply({
                            content: "❌ Chave PIX não configurada. Contate um administrador.",
                            ephemeral: true
                        });
                    }

                    const orderPix = client.orderMessages.get(interaction.message.id);
                    const finalPrice = orderPix?.finalPrice ?? 0;

                    const copiaCola = buildPixPayload(pixKey, pixName, pixCity, finalPrice);

                    const embed = new EmbedBuilder()
                        .setColor("#00E5FF")
                        .setTitle("💸 Copia e Cola PIX")
                        .setDescription(
                            `**Valor:** R$ ${finalPrice.toFixed(2).replace(".", ",")}\n\n` +
                            `📋 **Cole esse código no seu app do banco:**\n\`\`\`${copiaCola}\`\`\`` +
                            "\nApós pagar, aguarde a confirmação da staff."
                        )
                        .setFooter({ text: "SafiraSMP • Pagamento via PIX" });

                    return interaction.reply({ embeds: [embed] });
                }

                // ── Tickets ──────────────────────────
                case "ticket_compras":
                case "ticket_parcerias":
                case "ticket_denuncia":
                case "ticket_suporte": {

                    const tipo     = TIPOS_TICKET[interaction.customId];
                    const username = interaction.user.username.toLowerCase().replace(/[^a-z0-9]/g, "");
                    const nomeCh   = `${tipo.emoji}・${username}`;

                    const existente = interaction.guild.channels.cache.find(c => c.name === nomeCh);

                    if (existente) {
                        return interaction.reply({
                            content: `❌ Você já tem um ticket aberto: ${existente}`,
                            ephemeral: true
                        });
                    }

                    try {
                        const canal = await interaction.guild.channels.create({
                            name: nomeCh,
                            type: 0,
                            permissionOverwrites: [
                                { id: interaction.guild.id,  deny:  [PermissionsBitField.Flags.ViewChannel] },
                                { id: interaction.user.id,   allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory] },
                                { id: client.user.id,        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory, PermissionsBitField.Flags.ManageChannels] }
                            ]
                        });

                        const embedBemVindo = new EmbedBuilder()
                            .setColor("#00E5FF")
                            .setTitle(`${tipo.emoji} Ticket — ${tipo.label}`)
                            .setDescription(`Olá, ${interaction.user}! 👋\n\nBem-vindo ao seu ticket de **${tipo.label}**.\nDescreva sua situação com o máximo de detalhes possível e a equipe irá te atender em breve.\n\n> 🔒 Apenas você e a staff podem ver este canal.`)
                            .setFooter({ text: "SafiraSMP • Tickets" })
                            .setTimestamp();

                        await canal.send({ content: `${interaction.user}`, embeds: [embedBemVindo] });

                        return interaction.reply({
                            content: `✅ Ticket criado com sucesso! ${canal}`,
                            ephemeral: true
                        });

                    } catch (err) {
                        console.error("Erro ao criar ticket:", err);
                        return interaction.reply({
                            content: "❌ Não consegui criar o ticket. Verifique se o bot tem permissão de **Gerenciar Canais**.",
                            ephemeral: true
                        });
                    }
                }

            }

            return;
        }

        // ══════════════════════════════════════════════
        // SELECT MENU
        // ══════════════════════════════════════════════
        if (interaction.isStringSelectMenu()) {

            if (interaction.customId === "loja_select") {
                const itemKey = interaction.values[0];
                const item    = LOJA_ITEMS[itemKey];

                if (!item) return interaction.update({ content: "❌ Item inválido.", components: [] });

                // Salva a escolha no cache
                client.purchaseCache.set(interaction.user.id, {
                    itemKey,
                    originalPrice: item.price,
                    finalPrice: item.price,
                    coupon: null,
                    discount: 0,
                    messageId: null
                });

                const embed = new EmbedBuilder()
                    .setColor("#00E5FF")
                    .setTitle("🛒 Item Selecionado")
                    .setDescription(
                        `${item.emoji} **${item.label}**\n\n` +
                        `💰 Preço: **R$ ${item.price.toFixed(2).replace(".", ",")}**\n\n` +
                        "Tem um cupom de desconto? Clique abaixo para aplicar.\n" +
                        "Caso contrário, prossiga com o pagamento."
                    )
                    .setFooter({ text: "SafiraSMP • Loja" });

                const botao = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId("loja_addcupom")
                        .setLabel("🏷️  Adicionar Cupom")
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId("loja_prosseguir")
                        .setLabel("💳  Prosseguir sem cupom")
                        .setStyle(ButtonStyle.Primary)
                );

                return interaction.update({ embeds: [embed], components: [botao] });
            }

            return;
        }

        // ══════════════════════════════════════════════
        // MODAL SUBMIT
        // ══════════════════════════════════════════════
        if (interaction.isModalSubmit()) {

            // ── Verificação ──────────────────────────
            if (interaction.customId === "modal_verificacao") {
                const texto = interaction.fields
                    .getTextInputValue("input_verificacao")
                    .trim()
                    .toLowerCase();

                if (texto !== PALAVRA_VERIFICACAO) {
                    return interaction.reply({
                        content: "❌ Palavra incorreta. Clique no botão de verificar e tente novamente.",
                        ephemeral: true
                    });
                }

                const membro = interaction.member;

                if (membro.roles.cache.has(CARGO_VERIFICADO_ID)) {
                    return interaction.reply({
                        content: "ℹ️ Você já está verificado!",
                        ephemeral: true
                    });
                }

                try {
                    if (membro.roles.cache.has(CARGO_NAO_VERIFICADO_ID)) {
                        await membro.roles.remove(CARGO_NAO_VERIFICADO_ID);
                    }
                    await membro.roles.add([CARGO_VERIFICADO_ID, CARGO_MEMBRO_ID]);

                    const embedSucesso = new EmbedBuilder()
                        .setColor("#2ecc71")
                        .setTitle("✅ Você verificou com sucesso!")
                        .setDescription(
                            `Seja muito bem-vindo(a) ao **${interaction.guild.name}**, ${interaction.user}! 🎉\n\n` +
                            "Agora você já tem acesso completo aos canais, benefícios e eventos do servidor.\n\n" +
                            "Aproveite sua estadia e divirta-se! 💎"
                        )
                        .setThumbnail(interaction.guild.iconURL({ size: 256 }) ?? null)
                        .setFooter({ text: "SafiraSMP • Sistema de Verificação" })
                        .setTimestamp();

                    return interaction.reply({
                        embeds: [embedSucesso],
                        ephemeral: true
                    });
                } catch (err) {
                    console.error("Erro ao verificar membro:", err);
                    return interaction.reply({
                        content: "❌ Não consegui atualizar seus cargos. Verifique se o cargo do bot está acima dos cargos \"Verificado\" e \"Não verificado\".",
                        ephemeral: true
                    });
                }
            }

            // ── Recusar sugestão ──────────────────────
            if (interaction.customId.startsWith("sug_recusar_modal:")) {
                const sugId = interaction.customId.split(":")[1];
                const sug   = client.sugestoesCache.get(sugId);
                if (!sug) return interaction.reply({ content: "❌ Sugestão não encontrada.", ephemeral: true });

                const motivo = interaction.fields.getTextInputValue("sug_motivo_input").trim();
                sug.status   = "recusada";
                const embed  = embedRecusada(sug, interaction.user.username, motivo);

                // Atualiza mensagem no canal da staff
                await interaction.update({ embeds: [embed], components: [] });

                // Atualiza mensagem no canal de sugestões
                const chSug  = interaction.guild.channels.cache.get(sug.channelId);
                const msgSug = await chSug?.messages.fetch(sug.messageId).catch(() => null);
                if (msgSug) await msgSug.edit({ embeds: [embed], components: [] });

                // Envia no canal de recusadas
                const chRecusadas = interaction.guild.channels.cache.get(config.canais.sugestoesRecusadas);
                if (chRecusadas) await chRecusadas.send({ embeds: [embed] });

                return;
            }

            if (interaction.customId === "loja_cupom_modal") {
                const cupom   = interaction.fields.getTextInputValue("loja_cupom_input").trim().toUpperCase();
                const cache   = client.purchaseCache.get(interaction.user.id);

                if (!cache) {
                    return interaction.reply({ content: "❌ Sessão expirada. Use /loja novamente.", ephemeral: true });
                }

                const percentDesconto = CUPONS[cupom];
                if (!percentDesconto) {
                    return interaction.reply({
                        content: "❌ Cupom inválido. Verifique o código e tente novamente.",
                        ephemeral: true
                    });
                }

                const desconto   = parseFloat((cache.originalPrice * percentDesconto / 100).toFixed(2));
                const finalPrice = parseFloat((cache.originalPrice - desconto).toFixed(2));
                const item       = LOJA_ITEMS[cache.itemKey];

                // Atualiza cache com desconto
                cache.coupon     = cupom;
                cache.discount   = desconto;
                cache.finalPrice = finalPrice;

                const embedFinal = new EmbedBuilder()
                    .setColor("#00E5FF")
                    .setTitle("✅ Cupom Aplicado com Sucesso!")
                    .setDescription(
                        `👤 Comprador: ${interaction.user}\n` +
                        `${item.emoji} **${item.label}**\n\n` +
                        `🏷️ Cupom: \`${cupom}\`\n` +
                        `💸 Desconto: -R$ ${desconto.toFixed(2).replace(".", ",")} (${percentDesconto}%)\n` +
                        `~~R$ ${cache.originalPrice.toFixed(2).replace(".", ",")}~~  →  **R$ ${finalPrice.toFixed(2).replace(".", ",")}**\n\n` +
                        "Escolha como deseja pagar:"
                    )
                    .setFooter({ text: "SafiraSMP • Loja" })
                    .setTimestamp();

                const botoes = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId("loja_confirmar")
                        .setLabel("✅  Confirmar")
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId("loja_qrcode")
                        .setLabel("📷  QR Code PIX")
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId("loja_pix")
                        .setLabel("💸  Copia e Cola PIX")
                        .setStyle(ButtonStyle.Secondary)
                );

                // Manda no canal (visível pra todos, inclusive admin)
                const sent = await interaction.channel.send({ embeds: [embedFinal], components: [botoes] });
                client.orderMessages.set(sent.id, {
                    buyerUserId: interaction.user.id,
                    itemKey: cache.itemKey,
                    finalPrice
                });

                // Apenas confirma o cupom de forma discreta
                await interaction.reply({ content: "✅ Cupom aplicado! Veja o pedido no canal.", ephemeral: true });
                return;
            }

            return;
        }

        // ══════════════════════════════════════════════
        // COMANDOS SLASH
        // ══════════════════════════════════════════════
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: "❌ Ocorreu um erro ao executar este comando.", ephemeral: true });
            } else {
                await interaction.reply({ content: "❌ Ocorreu um erro ao executar este comando.", ephemeral: true });
            }
        }

    }

};
