const { Events, EmbedBuilder } = require("discord.js");
const config = require("../config.json");
const { adicionarConvite } = require("../utils/convitesStore");

module.exports = {
    name: Events.GuildMemberAdd,

    async execute(member, client) {

        try {

            const guild         = member.guild;
            const cachedInvites = client.inviteCache.get(guild.id) || new Map();
            const newInvites    = await guild.invites.fetch();

            const usedInvite = newInvites.find(inv => {
                const cached = cachedInvites.get(inv.code) ?? 0;
                return inv.uses > cached;
            });

            client.inviteCache.set(
                guild.id,
                new Map(newInvites.map(inv => [inv.code, inv.uses]))
            );

            const canal = guild.channels.cache.get(config.canais.convites);
            if (!canal) return;

            if (usedInvite && usedInvite.inviter) {

                const inviter = usedInvite.inviter;

                // Soma permanentemente no total do inviter (não depende do convite continuar existindo)
                const totalPermanente = adicionarConvite(inviter.id);

                const embed = new EmbedBuilder()
                    .setColor("#00E5FF")
                    .setDescription(`📨 ${inviter} convidou ${member} e agora ${inviter} tem **${totalPermanente}** convite${totalPermanente !== 1 ? "s" : ""}!`)
                    .setFooter({ text: "SafiraSMP • Invite Tracker" })
                    .setTimestamp();

                await canal.send({ embeds: [embed] });

            } else {

                const embed = new EmbedBuilder()
                    .setColor("#00E5FF")
                    .setDescription(`📨 ${member} entrou no servidor, mas não foi possível identificar quem convidou.`)
                    .setFooter({ text: "SafiraSMP • Invite Tracker" })
                    .setTimestamp();

                await canal.send({ embeds: [embed] });

            }

        } catch (err) {
            console.error("Erro no invite tracker:", err);
        }

    }
};
