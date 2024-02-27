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

    await player.play(voiceChannel, url);

    await interaction.reply('Playing...');
  },
};
