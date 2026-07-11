const { Events } = require("discord.js");

// Canal onde a mensagem de boost vai aparecer
const CANAL_BOOST_ID = "1523051232271401010";

module.exports = {
    name: Events.GuildMemberUpdate,
    once: false,
    async execute(oldMember, newMember, client) {
        // Detecta se o membro não tinha boost antes e agora tem
        if (!oldMember.premiumSince && newMember.premiumSince) {
            const canal = newMember.guild.channels.cache.get(CANAL_BOOST_ID);
            if (!canal) return;

            const totalImpulsos = newMember.guild.premiumSubscriptionCount ?? 0;

            canal.send(
                `<@${newMember.id}> está impulsionando a **SafiraSMP**! ` +
                `Obrigado por apoiar o servidor 💜 e agora a Safira tem: **${totalImpulsos} impulsos**`
            );
        }
    },
};
