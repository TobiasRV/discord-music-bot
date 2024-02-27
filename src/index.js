/* eslint-disable no-console */
require('dotenv').config();

const { Player } = require('discord-player');
const {
  Client, Collection, GatewayIntentBits, REST, Routes,
} = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

const commands = [];
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

// eslint-disable-next-line no-restricted-syntax
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const command = require(filePath);

  client.commands.set(command.data.name, command);
  commands.push(command.data.toJSON());
}

async function createPlayer() {
  const player = new Player(client, {
    ytdlOptions: {
      quality: 'highestaudio',
      // eslint-disable-next-line no-bitwise
      highWaterMark: 1 << 25,
    },
  });

  await player.extractors.loadDefault();
}

function setGuildCommands() {
  const guildIds = client.guilds.cache.map((guild) => guild.id);
  const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);
  // eslint-disable-next-line no-restricted-syntax
  for (const guildId of guildIds) {
    rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId),
      { body: commands },
    )
      .then(() => console.log(`Successfully updated commands for guild ${guildId}`))
      .catch(console.error);
  }
}

client.on('ready', async () => {
  setGuildCommands();
  await createPlayer();
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute({ client, interaction });
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: 'There was an error executing this command',
    });
  }
});

client.on('guildCreate', () => {
  console.log('Updating bot servers');
  setGuildCommands();
});

client.login(process.env.DISCORD_TOKEN);
