require('dotenv').config();
const { WebClient } = require('@slack/web-api');
const express = require('express');
const app = express();
const axios = require('axios');

// env vars
const USER_OAUTH_TOKEN = process.env.USER_OAUTH_TOKEN;
const BOT_OAUTH_TOKEN = process.env.BOT_OAUTH_TOKEN;
const CHANNEL_ID = process.env.ADMIN_CHANNEL_ID;

const client = new WebClient(USER_OAUTH_TOKEN);

// Log actions in console and Slack Channel
const log = async (msg) => {
	console.log(msg);
	await client.chat.postMessage({
		token: BOT_OAUTH_TOKEN,
		text: msg,
		channel: CHANNEL_ID,
	});
};

app.get('/ping', (req, res) => {
	res.status(200).send("Hi! I'm awake");
	log('🤖 Pinged');
});

app.listen(process.env.PORT || 3000, async () => {
	try {
		log('🟢 Starting express server');
	} catch (err) {
		console.error(err);
		log('🚨 THERE WAS AN ERROR WITH THE EXPRESS SERVER');
	}
});

process.on('SIGINT' || 'SIGTERM', () => {
	log('🔴 Down');
});

axios({
	method: 'GET',
	url: 'https://mashape-community-urban-dictionary.p.rapidapi.com/define',
	headers: {
		'content-type': 'application/octet-stream',
		'x-rapidapi-host': 'mashape-community-urban-dictionary.p.rapidapi.com',
		'x-rapidapi-key': 'd25fd81fccmshb4886cf7c9c7720p1bf167jsn4c24989c03a5',
		useQueryString: true,
	},
	params: {
		term: 'run it',
	},
})
	.then((response) => {
		definition =
			response.data.list[Math.floor(Math.random() * response.data.list.length)]
				.definition;
		log(definition);
	})
	.catch((error) => {
		log(error);
	});
