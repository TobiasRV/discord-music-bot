const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('shows first 10 songs in the queue'),

  execute: async ({ interaction }) => {
    const queue = useQueue(interaction.guild.id);

    const tracks = queue.tracks.toArray();

    if (!queue) {
      await interaction.reply('There are no songs in the queue');
      return;
    }

    const queueString = tracks.map((song, i) => `${i + 1}) [${song.duration}] ${song.title}`).join('\n');

    const currentSong = queue.currentTrack;
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription(`**Currently Playing**\n${
            currentSong ? `[${currentSong.duration}] ${currentSong.title}` : 'None'
          }\n\n**Queue**\n${queueString}`)
          .setThumbnail(currentSong.thumbnail),
      ],
    });
  },
};
