const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { QueryType, useMainPlayer } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays a song from YouTube.")
    .addStringOption((option) =>
      option.setName("url").setDescription("the song's url").setRequired(true)
    ),
  execute: async ({ client, interaction }) => {
    const url = interaction.options.getString("url");
    if (!interaction.member.voice.channel)
      return interaction.reply(
        "You need to be in a Voice Channel to play a song."
      );
    try {
      const player = useMainPlayer();
      const { track } = await player.play(interaction.member.voice.channel, url, {
        nodeOptions: {
          metadata: interaction,
        },
      });

      let embed = new EmbedBuilder();
  
      embed
        .setDescription(
          `**[${track.title}](${track.url})** has been added to the Queue.`
        )
        .setThumbnail(track.thumbnail)
        .setFooter({ text: `Duration: ${track.duration}` });
  
      await interaction.reply({
        embeds: [embed],
      });
    } catch (error) {
      return interaction.reply(`error playing song, url: ${url}`);
    }
  },
};
