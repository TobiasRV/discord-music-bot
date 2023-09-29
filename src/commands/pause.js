const { SlashCommandBuilder } = require("@discordjs/builders")
const { useQueue } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pauses the current song"),
  execute: async ({ client, interaction }) => {
    const queue = useQueue(interaction.guild.id);

    if (!queue) {
      await interaction.reply("There are no songs in the queue")
      return;
    }

    queue.node.setPaused(true);

    await interaction.reply("Player has been paused.")
  },
}