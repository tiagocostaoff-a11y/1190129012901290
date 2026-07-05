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
        .setName("embed")
        .setDescription("Envia uma embed.")
        .addStringOption(option =>
            option
                .setName("tipo")
                .setDescription("Escolha a embed")
                .setRequired(true)
                .addChoices(
                    { name: "Mídia",   value: "midia"   },
                    { name: "Boost",   value: "boost"   },
                    { name: "Regras",  value: "regras"  },
                    { name: "Ticket",  value: "ticket"  }
                )
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {

        const tipo = interaction.options.getString("tipo");

        if (tipo === "midia") {

            const embed = new EmbedBuilder()
                .setColor("#8A2BE2")
                .setTitle("🎥 TAG MÍDIA - SafiraSMP")
                .setDescription(`
É Streamer, TikToker ou YouTuber?
Faça parte da nossa Equipe Mídia e ajude a divulgar o **SafiraSMP**!

✨ Cargo exclusivo de @🎥・Mídia
🎬 Divulgação do seu canal em nosso Discord e redes sociais
🎫 Prioridade no atendimento de tickets
💬 Contato direto com a equipe para campanhas e eventos
🎁 Recompensas exclusivas por metas de divulgação
💎 Benefícios especiais dentro do servidor
🚀 Oportunidade de crescer junto com o SafiraSMP

## 📋 Requisitos

• Ser criador de conteúdo ativo no TikTok, YouTube ou Twitch.
• Produzir conteúdo de Minecraft com boa qualidade.
• Possuir um público intermediário, tendo no mínimo:

**TikTok**
• Média de 5k de visualizações por vídeo.
• 1 vídeo semanal relacionado ao servidor.

**YouTube / Shorts**
• 500 inscritos.
• 1 vídeo ou Short semanal relacionado ao servidor.

**Twitch**
• 200 seguidores.
• Média de 10 espectadores simultâneos.
• 2 lives semanais.

━━━━━━━━━━━━━━━━━━━━━━

Os benefícios da Equipe Mídia permanecem ativos enquanto o criador cumprir os requisitos de atividade e parceria.

O cargo poderá ser removido em casos de inatividade prolongada ou descumprimento das diretrizes do programa.

Caso cumpra os requisitos e tenha interesse, abra um 🎫・ticket para o prosseguimento do processo seletivo.
`)
                .setFooter({ text: "SafiraSMP • Equipe Mídia" });

            await interaction.reply({ embeds: [embed] });

        } else if (tipo === "boost") {

            const embed = new EmbedBuilder()
                .setColor("#0099FF")
                .setTitle("🚀 Boost — Safira SMP")
                .setDescription(`Impulsione o Safira SMP e desbloqueie benefícios exclusivos!

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

💜 Todos os benefícios permanecem ativos enquanto o boost estiver ativo.`)
                .setFooter({ text: "SafiraSMP • Boost" });

            await interaction.reply({ embeds: [embed] });

        } else if (tipo === "regras") {

            const embed = new EmbedBuilder()
                .setColor("#00E5FF")
                .setAuthor({ name: "💎 Safira SMP" })
                .setTitle("📜 Regras SafiraSMP")
                .setDescription(`Nosso objetivo é oferecer um ambiente justo, divertido e respeitoso para todos. Ao jogar no SafiraSMP ou participar de qualquer uma de nossas plataformas, incluindo redes sociais e esse servidor Discord, você concorda com todas as regras descritas abaixo.

As regras se aplicam igualmente a todos os jogadores, independentemente de cargo, benefícios adquiridos, tempo de servidor ou qualquer outro fator.

Podemos atualizar este regulamento sempre que necessário para manter a segurança e o bom funcionamento da comunidade.

Também não nos responsabilizamos por contas compartilhadas e acessos concedidos a terceiros. Mantenha sua conta segura.

━━━━━━━━━━━━━━━━━━━━━━

**💬 1. Uso do chat**
Não é permitido:
• Ofender exageradamente ou perseguir outros jogadores.
• Utilizar linguagem discriminatória ou de ódio (incluindo racismo, homofobia, intolerância religiosa, entre outros).
• Fazer spam, flood ou mensagens excessivamente repetitivas.
• Divulgar informações falsas para prejudicar outros jogadores.

**🚫 2. Cheats e vantagens ilegais**
É proibido utilizar qualquer recurso que conceda vantagem injusta, incluindo mas não se limitando a:
Fly • Reach • KillAura • AutoTotem • Freecam • Autoclick • Macros • Clients modificados • Minimap com localização de minérios ou estruturas.
> Observação: X-Ray é liberado somente com o uso de texturas (resourcepacks). Caso sejam identificados clientes externos, não realizaremos desbanimentos.
Receber ajuda direta de jogadores utilizando esses recursos também poderá resultar em punição.

**🐞 3. Exploração de bugs**
Encontrou um bug? Reporte imediatamente à equipe.
Explorar falhas para conseguir vantagens, prejudicar outros jogadores ou causar instabilidade no servidor poderá resultar em punições severas (exploit, dupe ou qualquer falha que conceda vantagem indevida).

**📢 4. Divulgação**
Não é permitido divulgar sem autorização: outros servidores, sites, redes sociais, convites, vídeos, produtos ou serviços. Também é proibida a divulgação de vendas envolvendo dinheiro real nos canais oficiais do servidor.

**🔞 5. Conteúdos impróprios**
Não utilize: nomes ofensivos, skins inadequadas, foto de perfil ou banner inadequada, itens renomeados com conteúdo ofensivo, construções ou símbolos impróprios. Todo conteúdo deve respeitar a comunidade.

**🔒 6. Privacidade**
É proibido divulgar informações pessoais de qualquer jogador sem sua autorização (doxxing).

**💸 7. Comércio entre jogadores**
Negociações envolvendo dinheiro real ou itens no jogo são expressamente proibidas. A equipe não garante suporte, reembolso ou mediação nesses casos.

**🎫 8. Uso dos tickets**
Os tickets existem para resolver problemas reais. Antes de abrir um, leia o FAQ no topo do canal de Tickets. Não pressione a equipe para acelerar atendimentos. Os tickets são atendidos com ordem de prioridade, onde jogadores VIPs recebem prioridade por apoiarem diretamente o servidor.

**🎭 9. Traps e invasões**
Estratégias como blefes, traps, traições, roubo de bases e enganações fazem parte da jogabilidade do SafiraSMP. A equipe não realiza rollback ou reembolso de itens perdidos nessas situações. Apenas casos envolvendo bugs ou descumprimento das regras serão analisados.

**👥 10. Uso de contas alternativas**
Cada jogador poderá possuir no máximo duas contas. Não é permitido utilizar contas alternativas ou terceiros para burlar punições, manipular estatísticas ou explorar mecânicas do servidor.
> Exceção: gemas no /afk. As Gemas são intransferíveis entre jogadores e não podem ser enviadas para outras contas. No entanto, podem ser utilizadas normalmente para realizar compras em nosso servidor. Os itens recebidos podem ser transferidos de uma conta para outra.`)
                .setFooter({ text: "SafiraSMP • Regulamento Oficial" })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

        } else if (tipo === "ticket") {

            const imagem = new AttachmentBuilder(
                path.join(__dirname, "..", "assets", "boasvindas.png"),
                { name: "banner.png" }
            );

            const embed = new EmbedBuilder()
                .setColor("#00E5FF")
                .setTitle("🎫 Help & Support")
                .setDescription(`• 🛒 **Compras** — Suporte relacionado a VIP/Loja

• 💎 **Parcerias** — Caso queira uma parceria, crie um ticket!

• 🚨 **Denúncia** — Denunciar jogadores que descumprem as regras

• 🖥️ **Suporte** — Dúvidas, bugs ou falar com a Staff

━━━━━━━━━━━━━━━━━━━━━━

🔒 **Atendimento privado:**
Apenas você e a staff poderão ver seu ticket.

💡 **Dica:**
Quanto mais detalhes você fornecer, mais rápido poderemos te ajudar!

⚠️ **Sobre o ticket Urgente:**
Use apenas em situações realmente críticas. Uso indevido pode resultar em punição.

🚀 Clique em uma das opções abaixo e abra seu ticket!`)
                .setImage("attachment://banner.png")
                .setFooter({ text: "SafiraSMP • Tickets" });

            const botoes = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId("ticket_denuncia")
                    .setLabel("Denúncia")
                    .setEmoji("🚨")
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId("ticket_suporte")
                    .setLabel("Suporte")
                    .setEmoji("🖥️")
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("ticket_compras")
                    .setLabel("Compras")
                    .setEmoji("🛒")
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("ticket_parcerias")
                    .setLabel("Parcerias")
                    .setEmoji("💎")
                    .setStyle(ButtonStyle.Secondary)
            );

            await interaction.reply({
                embeds: [embed],
                files: [imagem],
                components: [botoes]
            });

        }

    }
};
