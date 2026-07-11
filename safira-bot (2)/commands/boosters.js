const { Events } = require('discord.js');

client.on(Events.GuildMemberUpdate, (oldMember, newMember) => {
  // Detecta se o membro começou a impulsionar agora (não tinha boost antes, agora tem)
  if (!oldMember.premiumSince && newMember.premiumSince) {
    const canal = newMember.guild.channels.cache.get('ID_DO_CANAL_AQUI');
    if (!canal) return;

    const totalImpulsos = newMember.guild.premiumSubscriptionCount;

    canal.send(
      `@${newMember.user.username} está impulsionando a SafiraSMP! ` +
      `Obrigado por apoiar o servidor 💜 e agora a Safira tem: **${totalImpulsos} impulsos**`
    );
  }
});
