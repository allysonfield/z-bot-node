
const express = require('express');
const DiscordJS = require('discord.js')
const fs = require('fs');
const schedule = require('node-schedule');

const app = express();

const dotenv = require('dotenv')
dotenv.config()

const client = new DiscordJS.Client({
  intents: [
    DiscordJS.Intents.FLAGS.GUILDS,
    DiscordJS.Intents.FLAGS.GUILD_MESSAGES,
    DiscordJS.Intents.FLAGS.GUILD_VOICE_STATES,
    DiscordJS.Intents.FLAGS.GUILD_MESSAGE_REACTIONS
  ]
});

client.commands = new DiscordJS.Collection();

const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

const eventFiles = fs
  .readdirSync("./events")
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  console.log(
    `${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`
  );

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "При выполнении этой команды произошла ошибка!",
      ephemeral: true
    });
  }
});

client.once('ready', () => {
  setInterval(() => {
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    const channel = guild.channels.cache.get(process.env.GENERAL_ID);
    channel.send('Hello world')
   
    console.log('works!')
  }, 3000);
})


client.on('ready', () => {
  console.log('The bot is ready')
})

client.on('messageCreate', (message) => {
  if(message.content === 'Brinquedinho'){
    message.reply({
      content: 'Do Inferno'
    })
  }
})




app.set("views", "./views");
app.set("view engine", "pug");

app.get("/", (request, response) => {
  response.render("index", {
    title: "Discord Bot",
    message: "Discord Bot is alive!"
  });
});




app.listen(3000, () => {
  console.log("App started");
});


client.login(process.env.TOKEN);

