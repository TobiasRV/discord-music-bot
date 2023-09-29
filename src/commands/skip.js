const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js");
const { useQueue } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips the current song"),

  execute: async ({ client, interaction }) => {
    const queue = useQueue(interaction.guild.id);

    if (!queue) {
      await interaction.reply("There are no songs in the queue");
      return;
    }

    const currentSong = queue.currentTrack;

    queue.node.skip();

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription(`${currentSong.title} has been skipped!`)
          .setThumbnail(currentSong.thumbnail)
      ]
    })
  },
}