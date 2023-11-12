const config = require('@/config.cjs');
const { Collection } = require('discord.js');
const { Client, GatewayIntentBits } = require('discord.js');
const glob = require('glob').glob;
const { join } = require('path');
const { console } = require('sneaks');
const express = require('express');
const app = express();

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
	partials: [],
	rest: {
		offset: 0,
	},
	ws: {
		large_threshold: 250,
	},
});

/** @type {Collection<string, any>} */
client.commands = new Collection();

async function reloadCommands() {
	const commandFiles = await glob('**/*.cjs', {
		cwd: join(__dirname, 'commands'),
	});

	for await (const commandDir of commandFiles) {
		const path = `./commands/${commandDir}`;
		const command = require(path);

		if ('data' in command && 'run' in command) {
			client.commands.set(command.data.name, command);
		}

		delete require.cache[require.resolve(path)];
	}
}

async function reloadEvents() {
	const eventFiles = await glob('*.cjs', {
		cwd: join(__dirname, 'events'),
	});

	for await (const eventDir of eventFiles) {
		const path = `./events/${eventDir}`;
		const event = require(path);

		if ('category' in event && 'run' in event) {
			client.on(event.category, (...args) => event.run(...args));
		}

		delete require.cache[require.resolve(path)];
	}
}

function portRegister() {
	app.get('/', (_req, res) => {
		res.json({ api: 'Hello World!' });
	});

	app.listen(3000);
}

reloadEvents();
reloadCommands();
portRegister();

client.login(config.token).catch(() => {
	console.error('Discord API\'ye istek gönderimi başarısız.');
});
