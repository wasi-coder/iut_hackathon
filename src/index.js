require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once("clientReady", () => {
    console.log(`${client.user.tag} is online`);
});

client.on("messageCreate", message => {

    if(message.author.bot) return;

    if(message.content === "!hello"){

        message.reply("Hello from IUT Hackathon Bot!");

    }

});

client.on("messageCreate", message => {

    if(message.author.bot) return;

    if(message.content === "!status"){

        message.reply(
`Drawing Room
Lights: 2 ON
Fans: 1 ON`
        );

    }

});

client.login(process.env.TOKEN);