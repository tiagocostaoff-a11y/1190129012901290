const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("staffformu")
        .setDescription("Envia o formulário de recrutamento para Staff.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {

        const embed = new EmbedBuilder()
            .setColor("#00E5FF")
            .setAuthor({
                name: "💎 Safira SMP"
            })
            .setTitle("📋 Recrutamento STAFF - SafiraSMP")
            .setDescription(`Estamos recrutando novos membros para a nossa Equipe Helper do SafiraSMP!

━━━━━━━━━━━━━━━━━━━━━━

**✅ Requisitos mínimos obrigatórios**
- Ter no mínimo 12 anos.
- Ser ativo no servidor e Discord.
- Possuir disponibilidade de pelo menos 5 dias por semana.
- Saber se comunicar de forma clara e respeitosa com todos.
- Possuir microfone com boa qualidade.
- Trabalhar bem em equipe e respeitar a hierarquia.
- Demonstrar maturidade e bom comportamento na comunidade.
- Ter a capacidade de tirar dúvidas dos jogadores relacionadas ao servidor.

O cargo STAFF permanece ativo enquanto o membro mantiver um bom desempenho, atividade e comprometimento com a equipe. Em casos de inatividade, o Staff poderá ser desligado.

Caso cumpra os requisitos e tenha interesse, preencha o formulário abaixo:
🔗 [**Clique aqui para se candidatar**](https://forms.gle/3NR23fNZjXySuAYa7)`)
            .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 1024 }))
            .setFooter({
                text: "SafiraSMP • Recrutamento Staff"
            })
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });

    }
};
