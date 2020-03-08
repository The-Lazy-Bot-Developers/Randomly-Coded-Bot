const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const queue = new Map();
const ytdl = require('ytdl-core');
const { RichEmbed } = require('discord.js')
const version = 'version'

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

for (const file of eventFiles) {
	const event = require(`./events/${file}`);

	// set a new item in the Collection
	// with the key as the event name and the value as the exported module
	client.event.set(event.name, event);
}

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command)) return;

	try {
		client.commands.get(command).execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

client.on('message', message => {
	if (message.author.bot) return;

   const args = message.content.slice(prefix.length).split(/ +/);
   const command = args.shift().toLowerCase();

   if (!client.commands.has(command)) return;

   try {
	   client.commands.get(command).execute(message, args);
   } catch (error) {
	   console.error(error);
	   message.reply('there was an error trying to execute that event!');
   }
});


client.once('ready', () => {
	console.log('Ready!');
});

client.once('ready', () => {
	const path = './debug.flag'
try {
  if (fs.existsSync(path)) {
	//file exists
	global.sessionid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
	var today = new Date();
	var date = today.getMonth()+1+'-'+(today.getDate())+'-'+today.getFullYear();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	global.dateTime = date+' '+time;
	const exampleEmbed = new Discord.RichEmbed()
	.setColor('#f8f8ff')
	.setTitle('Debug Mode')
	.addField('Test session ID', sessionid)
	.addField('Current date/time', dateTime)
	.addField('---', 'The session has started.')

	client.channels.get(`683751300063690885`).send(exampleEmbed);


  }
} catch(err) {
  console.error(err)
}
})

//uh oh something went wrong
client.on('error', error => {
	const errorembed = new Discord.RichEmbed()
	.setColor('#ff0000')
	.setTitle('Debug Mode Error')
    .addField('Error', error)
	client.channels.get(`683751300063690885`).send(errorembed)
	console.error('an error has occured', error);
});


// login to Discord with your app's token
client.login(token);;

// Set the bot's presence (activity and status)
client.on("ready", () => {
    client.user.setPresence({
        game: { 
            name: 'really bad commands',
            type: 'LISTENING'
        },
        status: 'online'
    })
})

//Don't ask
client.on('message', msg => {
    if (msg.content.includes('tomger')) {
		if (msg.content.includes('tomger is god')) {msg.channel.send('Yes')
		return;}
			msg.channel.send('@tomGER#7462 eta wen kosmos v' + Math.ceil(Math.random() * 30)); 
     }
});

//Don't ask
client.on('message', msg => {
		if (msg.content.includes('<@!683752278490087485>')) {
			msg.channel.send('<@683752278490087485> bad');
		}
});

//tools for dev server
client.on('message', message => {
if (message.channel.id === '684648686063583260') {
	var today = new Date();
	var date = today.getMonth()+1+'-'+(today.getDate())+'-'+today.getFullYear();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const msgtochanneldebug = new Discord.RichEmbed()
  	.setColor('#1a1aff')
  	.setTitle('Debug Mode Note')
	.addField('Test session ID', sessionid)
    .addField('Current date/time', dateTime)
    .addField('Note', message.content)
    .addField('Note added by', message.author.username)
	message.client.channels.get(`683751300063690885`).send(msgtochanneldebug);
	message.delete(message)
}
if (message.channel.id === '684659501890011137') {
	if (message.content.includes === 'important news'){
		const msgtonews = new Discord.RichEmbed()
		.setColor('#ff0000')
		.setTitle('Important news update')
	  .addField('Message', message.content)
	  .addField('Released by', message.author.username)
	  message.client.channels.get(`684657303936434176`).send(msgtonews);
	  message.client.channels.get(`684657303936434176`).send('@everyone');
	  message.delete(message)
	  return;
	}
    const msgtonews = new Discord.RichEmbed()
  	.setColor('#ffff00')
  	.setTitle('News update')
    .addField('Message', message.content)
    .addField('Released by', message.author.username)
	message.client.channels.get(`684657303936434176`).send(msgtonews);
	message.delete(message)
}

})

//temp thing for play, stop, and skip commands
client.on('message', async message => {
	if (message.author.bot) return;
	if (!message.content.startsWith(prefix)) return;

	const serverQueue = queue.get(message.guild.id);

	if (message.content.startsWith(`${prefix}play`)) {
		execute(message, serverQueue);
		return;
	} else if (message.content.startsWith(`${prefix}skip`)) {
		skip(message, serverQueue);
		return;
	} else if (message.content.startsWith(`${prefix}stop`)) {
		stop(message, serverQueue);
		return;
	}
});

async function execute(message, serverQueue) {
	const args = message.content.split(' ');

	const voiceChannel = message.member.voiceChannel;
	if (!voiceChannel) return message.channel.send('You need to be in a voice channel to play music!');
	const permissions = voiceChannel.permissionsFor(message.client.user);
	if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
		return message.channel.send('I need the permissions to join and speak in your voice channel!');
	}

	const songInfo = await ytdl.getInfo(args[1]);
	const song = {
		title: songInfo.title,
		url: songInfo.video_url,
	};

	if (!serverQueue) {
		const queueContruct = {
			textChannel: message.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true,
		};

		queue.set(message.guild.id, queueContruct);

		queueContruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueContruct.connection = connection;
			play(message.guild, queueContruct.songs[0]);
		} catch (err) {
			console.log(err);
			queue.delete(message.guild.id);
			return message.channel.send(err);
		}
	} else {
		serverQueue.songs.push(song);
		console.log(serverQueue.songs);
		return message.channel.send(`${song.title} has been added to the queue!`);
	}

}

function skip(message, serverQueue) {
	if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music!');
	if (!serverQueue) return message.channel.send('There is no song that I could skip!');
	serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
	if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music!');
	serverQueue.songs = [];
	serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}

	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
		.on('end', () => {
			console.log('Music ended!');
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => {
			console.error(error);
		});
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
}