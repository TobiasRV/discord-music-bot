const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('loop')
    .setDescription('Select the loop options')
    .addStringOption((option) => option.setName('mode')
      .setDescription("the song's url")
      .setRequired(true)
      .addChoices(
        { name: 'Off', value: '0' },
        { name: 'Song', value: '1' },
        { name: 'Queue', value: '2' },
      )),
  execute: async ({ interaction }) => {
    const embed = new EmbedBuilder();
    const input = interaction.options.getString('mode');
    const mode = Number(input);

    const queue = useQueue(interaction.guild.id);
    const track = queue.currentTrack;
    switch (mode) {
      case 0:
        embed.setDescription('Loop turned off');
        break;
      case 1:
        embed
          .setDescription(`${track.title} looping`)
          .setThumbnail(track.thumbnail)
          .setFooter({ text: `Duration: ${track.duration}` });
        break;
      case 2:
        embed.setDescription('Queue looping');
        break;
      default:
        await interaction.reply('Invalid option');
        break;
    }

    queue.setRepeatMode(mode);

    await interaction.reply({
      embeds: [embed],
    });
  },
};
