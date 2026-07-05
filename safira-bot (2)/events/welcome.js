const {
    Events,
    EmbedBuilder,
    AttachmentBuilder
} = require("discord.js");

const path = require("path");
const config = require("../config.json");

module.exports = {
    name: Events.GuildMemberAdd,

    async execute(member) {

        try {

            const canal = member.guild.channels.cache.get(config.canais.entrada);

            if (!canal) {
                console.log("❌ Canal de boas-vindas não encontrado.");
                return;
            }

            const imagem = new AttachmentBuilder(
                path.join(__dirname, "..", "assets", "boasvindas.png"),
                {
                    name: "boasvindas.png"
                }
            );

            const texto = config.mensagem.texto
                .replace("{user}", `${member}`)
                .replace("{server}", config.nomeServidor);

            const embed = new EmbedBuilder()
                .setColor(config.cor)
                .setTitle(`💎 ${config.mensagem.titulo}`)
                .setDescription(`> ${texto}`)
                .addFields(
                    {
                        name: "💬 Chat",
                        value: `<#${config.canais.chat}>`,
                        inline: true
                    },
                    {
                        name: "📢 Anúncios",
                        value: `<#${config.canais.anuncios}>`,
                        inline: true
                    },
                    {
                        name: "📜 Regras",
                        value: `<#${config.canais.regras}>`,
                        inline: true
                    }
                )
                .setThumbnail(member.user.displayAvatarURL())
                .setImage("attachment://boasvindas.png")
                .setFooter({
                    text: `💎 ${config.nomeServidor} • ID: ${member.id}`
                })
                .setTimestamp();

            await canal.send({
                content: `${member}`,
                embeds: [embed],
                files: [imagem]
            });

            console.log(`✅ Mensagem de boas-vindas enviada para ${member.user.tag}`);

        } catch (error) {

            console.error("Erro no sistema de boas-vindas:", error);

        }

    }
};
