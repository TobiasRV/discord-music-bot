const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resume')
    .setDescription('Resumes the current song'),
  execute: async ({ interaction }) => {
    const queue = useQueue(interaction.guild.id);

    if (!queue) {
      await interaction.reply('No songs in the queue');
      return;
    }

    queue.node.setPaused(false);

    await interaction.reply('Player has been resumed.');
  },
};
