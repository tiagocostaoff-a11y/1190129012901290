require("dotenv").config();
const { REST, Routes } = require("discord.js");
const fs = require("fs");
const path = require("path");
const config = require("./config.json");
const commands = [];
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
    .readdirSync(commandsPath)
    .filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    if ("data" in command && "execute" in command) {
        commands.push(command.data.toJSON());
        console.log(`✅ /${command.data.name} preparado.`);
    }
}
const rawClientId = process.env.CLIENT_ID || "";
const clientId = rawClientId.includes("=") ? rawClientId.split("=").pop() : rawClientId;
const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
(async () => {
    try {
        console.log("🚀 Registrando comandos no servidor (guild)...");
        await rest.put(
            Routes.applicationGuildCommands(clientId, config.guildId),
            {
                body: commands
            }
        );
        console.log("✅ Comandos registrados com sucesso!");
    } catch (error) {
        console.error(error);
    }
})();
