const { Events, ActivityType } = require("discord.js");

module.exports = {
    name: Events.ClientReady,
    once: true,

    async execute(client) {

        console.clear();

        console.log("=================================");
        console.log("💎 Safira Bot iniciado com sucesso!");
        console.log(`🤖 Logado como: ${client.user.tag}`);
        console.log(`🌎 Servidores: ${client.guilds.cache.size}`);
        console.log("=================================");

        client.user.setPresence({
            activities: [
                {
                    name: "Safira SMP 💎",
                    type: ActivityType.Playing
                }
            ],
            status: "online"
        });

        // Cache invites for all guilds
        for (const guild of client.guilds.cache.values()) {
            try {
                const invites = await guild.invites.fetch();
                client.inviteCache.set(
                    guild.id,
                    new Map(invites.map(inv => [inv.code, inv.uses]))
                );
            } catch (err) {
                console.error(`❌ Erro ao cachear convites de ${guild.name}:`, err);
            }
        }

        console.log("📨 Cache de convites carregado!");

    }
};
