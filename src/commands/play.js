const { SlashCommandBuilder } = require('@discordjs/builders');
const { useMainPlayer } = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Plays a song from YouTube.')
    .addStringOption((option) => option.setName('url').setDescription("the song's url").setRequired(true)),
  execute: async ({ interaction }) => {
    const url = interaction.options.getString('url');

    const player = useMainPlayer();

    await player.play(interaction.member.voice.channel, url);

    await interaction.reply('Playing...');
  },
};
