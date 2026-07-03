require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");
const { discordToken } = require("./config");
const { getStatusMessage } = require("./commands/status");
const { getRoomMessage } = require("./commands/room");
const { getUsageMessage } = require("./commands/usage");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once("ready", () => {
    console.log(`${client.user.tag} is online`);
});

client.on("messageCreate", async message => {

    if (message.author.bot) {
        return;
    }

    const content = message.content.trim();
    const lowerContent = content.toLowerCase();

    try {
        if (lowerContent === "!status") {
            await message.reply(await getStatusMessage());
            return;
        }

        if (lowerContent.startsWith("!room")) {
            const roomName = content.slice(5).trim();
            await message.reply(await getRoomMessage(roomName));
            return;
        }

        if (lowerContent === "!usage") {
            await message.reply(await getUsageMessage());
            return;
        }

        if (lowerContent === "!hello") {
            await message.reply("Hello from IUT Hackathon Bot!");
        }

    } catch (error) {
        await message.reply(error.message || "Unable to reach the backend right now.");
    }

});

if (!discordToken) {
    console.error("Discord token is missing. Set TOKEN or DISCORD_TOKEN in the environment.");
} else {
    client.login(discordToken);
}