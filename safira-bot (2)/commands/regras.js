const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("regras")
        .setDescription("Envia o regulamento oficial do servidor.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {

        const embed = new EmbedBuilder()
            .setColor("#00E5FF")
            .setAuthor({
                name: "💎 Safira SMP"
            })
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
Fly • Reach • KillAura • AutoTotem • Freecam • Autoclick • Macros • Clients modificados • Minimap com localização de minérios • estruturas • Xray.
> Observação: O Xray na primeira punição ira ser de 3 horas mais se você usar novamente a punição vai aumentar para + horas ou ate **dias**!
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
            .setFooter({
                text: "SafiraSMP • Regulamento Oficial"
            })
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });

    }
};
