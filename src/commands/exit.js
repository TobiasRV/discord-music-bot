const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('exit')
    .setDescription('Kick the bot from the channel.'),
  execute: async ({ interaction }) => {
    const queue = useQueue(interaction.guild.id);

    if (!queue) {
      await interaction.reply('There are no songs in the queue');
      return;
    }

    queue.delete();

    await interaction.reply('queue deleted');
  },
};
