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
    try {
      const url = interaction.options.getString("url").trim();
      if(!url) return interaction.reply("Url required");
      console.log('=====================================================================');
      console.log('url', url);
      console.log('=====================================================================');
      if (!interaction.member.voice.channel)
        return interaction.reply(
          "You need to be in a Voice Channel to play a song."
        );
      const player = useMainPlayer();

      const searchResult = await player.search(url, { requestedBy: interaction.user });
      const { tracks } = searchResult;
      console.log('=====================================================================');
      console.log('searchResult', searchResult);
      console.log('=====================================================================');
      console.log('=====================================================================');
      console.log('tracks', tracks);
      console.log('=====================================================================');
      if(!searchResult){
        return interaction.reply("Song not found");
      }

      const trackResponse = await player.play(interaction.member.voice.channel, url, {
        nodeOptions: {
          metadata: interaction,
        },
      });

      console.log('=========================trackResponse===============================');
      console.log(JSON.stringify(trackResponse));
      console.log('=====================================================================');

      const { track } = trackResponse;

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
      console.log('=========================ERROR========================================');
      console.log(JSON.stringify(error));
      console.log('=====================================================================');
      return interaction.reply(`error playing song, url: ${url}`);
    }
  },
};
