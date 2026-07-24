const { EmbedBuilder } = require('discord.js');

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (message.content.trim() === '/staffformu') {

    const embed = new EmbedBuilder()
      .setColor('#00FFFF') // Ciano
      .setTitle('Recrutamento STAFF - SafiraSMP')
      .setDescription(
        'Estamos recrutando novos membros para a nossa Equipe Helper do SafiraSMP!\n\n' +
        '**Requisitos mínimos obrigatórios**\n' +
        '• Ter no mínimo 12 anos.\n' +
        '• Ser ativo no servidor e Discord.\n' +
        '• Possuir disponibilidade de pelo menos 5 dias por semana.\n' +
        '• Saber se comunicar de forma clara e respeitosa com todos.\n' +
        '• Possuir microfone com boa qualidade.\n' +
        '• Trabalhar bem em equipe e respeitar a hierarquia.\n' +
        '• Demonstrar maturidade e bom comportamento na comunidade.\n' +
        '• Ter a capacidade de tirar dúvidas dos jogadores relacionadas ao servidor.\n\n' +
        'O cargo STAFF permanece ativo enquanto o membro mantiver um bom desempenho, atividade e comprometimento com a equipe. Em casos de inatividade, o Staff poderá ser desligado.\n\n' +
        'Caso cumpra os requisitos e tenha interesse, preencha o formulário abaixo:\n' +
        '[Clique aqui para se candidatar](https://forms.gle/3NR23fNZjXySuAYa7)'
      )
      .setThumbnail(message.guild.iconURL({ dynamic: true, size: 1024 }))
      .setImage(message.guild.iconURL({ dynamic: true, size: 1024 }))
      .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
      .setTimestamp();

    await message.channel.send({ embeds: [embed] });

    // Opcional: apaga a mensagem do comando
    if (message.deletable) message.delete().catch(() => {});
  }
});
