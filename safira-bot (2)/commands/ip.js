const {
    SlashCommandBuilder,
    EmbedBuilder,
    AttachmentBuilder,
    PermissionFlagsBits
} = require("discord.js");

const path = require("path");

const IP_JAVA       = "br-01.blackhosting.com.br:30009";
const IP_BEDROCK    = "br-01.blackhosting.com.br";
const PORTA_BEDROCK = "30009";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ip")
        .setDescription("Mostra o IP do servidor.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {

        const imagem = new AttachmentBuilder(
            path.join(__dirname, "..", "assets", "ip-banner.png"),
            { name: "banner.png" }
        );

        const embed = new EmbedBuilder()
            .setColor("#00E5FF")
            .setAuthor({ name: "💎 Safira SMP" })
            .setTitle("🌐 IP DO SERVIDOR")
            .setDescription(`🎉 Chame seus amigos e venha já para o **SafiraSMP**: o melhor servidor SMP do Brasil!

💻 **Java Edition**
IP: \`${IP_JAVA}\`

📱 **Bedrock Edition**
IP: \`${IP_BEDROCK}\`
Porta: \`${PORTA_BEDROCK}\`

Esperamos você para viver grandes aventuras no **SafiraSMP**! 🚀`)
            .setImage("attachment://banner.png")
            .setFooter({ text: "SafiraSMP • IP do Servidor" })
            .setTimestamp();

        await interaction.reply({
            embeds: [embed],
            files: [imagem]
        });
    }
};
