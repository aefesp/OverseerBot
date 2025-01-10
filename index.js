// index.js

// Import required modules
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const TOKEN = process.env.DISCORD_TOKEN;
const TARGET_CHANNEL_ID = process.env.TARGET_CHANNEL_ID;

// Create a new Discord client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages,
    ],
    partials: [Partials.Channel], // Required to receive DMs
});

// Event: When the bot is ready
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// Event: When a message is created
client.on('messageCreate', async (message) => {
    // Check if the message is in the target channel
    if (message.channel.id !== TARGET_CHANNEL_ID) {
        return;
    }

    // Check if there are any user mentions in the message
    if (message.mentions.users.size > 0) {
        message.mentions.users.forEach(async (user) => {
            try {
                const embedsToSend = message.embeds.map((embed) => embed.toJSON());
                // Send a DM to the mentioned user
                await user.send({
                    content: 'You were mentioned!',
                    embeds: embedsToSend
                });

                console.log(`Sent DM to ${user.tag}`);
            } catch (error) {
                console.error(`Could not send DM to ${user.tag}.`, error);
            }
        });
    }
});

// Log in to Discord with your client's token
client.login(TOKEN);
