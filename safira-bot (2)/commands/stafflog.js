const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits
} = require("discord.js");

// Mapeamento dos cargos -> ID do cargo no servidor
const CARGOS = {
    admin: "1523051231595987005",
    mod: "1523051231595987006",
    staff: "1523051231595987009",
    ajudante: "1523051231595987007",
    midia: "1523051231595987011"
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stafflog")
        .setDescription("Registra a entrada de um novo membro na Staff.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option =>
            option.setName("nick")
                .setDescription("Nick do Minecraft da pessoa")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("cargo")
                .setDescription("Cargo que a pessoa vai ocupar")
                .setRequired(true)
                .addChoices(
                    { name: "Admin", value: "admin" },
                    { name: "Mod", value: "mod" },
                    { name: "Staff", value: "staff" },
                    { name: "Ajudante", value: "ajudante" },
                    { name: "Mídia", value: "midia" }
                ))
        .addUserOption(option =>
            option.setName("usuario")
                .setDescription("Membro que virou staff")
                .setRequired(true)),

    async execute(interaction) {

        const nick = interaction.options.getString("nick");
        const cargoEscolhido = interaction.options.getString("cargo");
        const usuario = interaction.options.getUser("usuario");

        const cargoId = CARGOS[cargoEscolhido];
        const nomesCargo = {
            admin: "Admin",
            mod: "Mod",
            staff: "Staff",
            ajudante: "Ajudante",
            midia: "Mídia"
        };

        // Cabeça da skin via nick (mc-heads.net)
        const skinHead = `https://mc-heads.net/avatar/${encodeURIComponent(nick)}/300`;

        const embed = new EmbedBuilder()
            .setColor("#00E5FF")
            .setDescription(`<@${usuario.id}> entrou na staff como: **${nomesCargo[cargoEscolhido]}** <@&${cargoId}>`)
            .setThumbnail(skinHead)
            .setFooter({
                text: "SafiraSMP 💎",
                iconURL: interaction.guild.iconURL({ dynamic: true })
            })
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });

        // Opcional: já dar o cargo automaticamente pro usuário
        // const membro = await interaction.guild.members.fetch(usuario.id);
        // await membro.roles.add(cargoId).catch(() => {});
    }
};
