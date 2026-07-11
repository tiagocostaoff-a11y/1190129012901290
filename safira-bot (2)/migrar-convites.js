// Rode esse script UMA VEZ pra migrar o histórico de convites antigo
// pro novo sistema (data/convites.json).
//
// Como rodar: node migrar-convites.js
// Depois disso pode apagar esse arquivo, ele não é usado pelo bot no dia a dia.

require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
const path = require("path");
const config = require("./config.json");

const DB_PATH = path.join(__dirname, "data", "convites.json");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildInvites
    ]
});

client.once("ready", async () => {
    console.log(`✅ Logado como ${client.user.tag}, buscando convites...`);

    try {
        const guild = client.guilds.cache.get(config.guildId);
        if (!guild) {
            console.error("❌ Não encontrei o servidor (confere o guildId no config.json).");
            process.exit(1);
        }

        const invites = await guild.invites.fetch();

        // Soma os usos de cada convite, agrupando por quem convidou
        const totals = {};
        for (const inv of invites.values()) {
            if (!inv.inviter) continue;
            totals[inv.inviter.id] = (totals[inv.inviter.id] || 0) + inv.uses;
        }

        // Se já existir um data/convites.json, faz a MAIOR entre o valor antigo e o migrado
        // (evita sobrescrever com um número menor por acidente)
        let atual = {};
        if (fs.existsSync(DB_PATH)) {
            atual = JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
        }

        const final = { ...atual };
        for (const [userId, total] of Object.entries(totals)) {
            final[userId] = Math.max(final[userId] || 0, total);
        }

        fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
        fs.writeFileSync(DB_PATH, JSON.stringify(final, null, 2));

        console.log(`✅ Migração concluída! ${Object.keys(final).length} pessoas com convites salvos em data/convites.json`);
        console.log(final);

    } catch (err) {
        console.error("❌ Erro na migração:", err);
    } finally {
        process.exit(0);
    }
});

client.login(process.env.TOKEN);
