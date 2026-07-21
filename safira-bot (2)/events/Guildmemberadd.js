const { Events } = require("discord.js");

// ─── Verificação ───────────────────────────────────────────────────────────────
const CARGO_NAO_VERIFICADO_ID = "1529232839764349020";

module.exports = {
    name: Events.GuildMemberAdd,

    async execute(member, client) {
        try {
            await member.roles.add(CARGO_NAO_VERIFICADO_ID);
        } catch (err) {
            console.error(`Erro ao dar cargo de não verificado para ${member.user.tag}:`, err);
        }
    }

};
