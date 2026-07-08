const fs = require("fs");
const path = require("path");

const {
    Client,
    Collection,
    GatewayIntentBits,
    REST,
    Routes
} = require("discord.js");

const config = require("./config.json");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildInvites
    ]
});

client.inviteCache = new Map();

// =======================
// COMANDOS
// =======================

client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandsParaRegistrar = [];

if (fs.existsSync(commandsPath)) {

    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

    for (const file of commandFiles) {

        const command = require(path.join(commandsPath, file));

        if ("data" in command && "execute" in command) {

            client.commands.set(command.data.name, command);
            commandsParaRegistrar.push(command.data.toJSON());

            console.log(`✅ Comando /${command.data.name} carregado!`);

        }

    }

}

// =======================
// AUTO-REGISTRO DOS SLASH COMMANDS
// =======================

async function registrarComandos() {
    try {
        const rawClientId = process.env.CLIENT_ID || "";
        const clientId = rawClientId.includes("=") ? rawClientId.split("=").pop() : rawClientId;

        const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

        console.log("🚀 Registrando comandos no servidor (guild)...");

        await rest.put(
            Routes.applicationGuildCommands(clientId, config.guildId),
            { body: commandsParaRegistrar }
        );

        console.log("✅ Comandos registrados com sucesso!");
    } catch (error) {
        console.error("❌ Erro ao registrar comandos:", error);
    }
}

// =======================
// EVENTOS
// =======================

const eventsPath = path.join(__dirname, "events");

if (fs.existsSync(eventsPath)) {

    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(".js"));

    for (const file of eventFiles) {

        const event = require(path.join(eventsPath, file));

        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }

        console.log(`📂 Evento ${event.name} carregado!`);

    }

}

// =======================
// LOGIN
// =======================

(async () => {
    await registrarComandos();
    client.login(process.env.TOKEN);
})();
