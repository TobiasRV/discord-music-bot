// eslint-disable-next-line import/no-extraneous-dependencies
const { SlashCommandBuilder } = require('@discordjs/builders');
const { useMainPlayer } = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Plays a song from YouTube.')
    .addStringOption((option) => option.setName('url').setDescription("the song's url").setRequired(true)),
  execute: async ({ interaction }) => {
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      await interaction.reply('You need to be in a voice channel to play music!');
    }

    const url = interaction.options.getString('url');

    if (!url) {
      await interaction.reply('You need to provide a song url!');
    }
    const player = useMainPlayer();
    let errorType;
    const track = await player.play(voiceChannel, url).catch(async (error) => {
      if (error.toString().includes('No results found for')) {
        errorType = 'No results found';
      } else {
        errorType = 'Unknown error';
      }
    });

    if (!errorType) {
      await interaction.reply(`${track.track.title} has been added to the queue`);
    } else if (errorType === 'No results found') {
      await interaction.reply(`No results found for the url: ${url}`);
    } else {
      await interaction.reply('An unknown error occurred');
    }
  },
};
