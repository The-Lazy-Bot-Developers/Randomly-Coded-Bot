module.exports = {
	name: 'endsession',
	description: 'Ends the session with reason',
	execute(message, args) {
	const Discord = require('discord.js');
	const client = new Discord.Client();
	const fs = require('fs');
	fs.appendFileSync('./logs/' + sessionid + '.debuglog', 'Note by ' + message.author.username + '\nNote:' + args.join(' ') +'\n\n Session ended.');
	message.reply('noted!');
	const noteforend = args.join(' ')
	const endsessionembed = new Discord.RichEmbed()
		.setColor('#ff0000')
		.setTitle('Debug Mode Session Ended')
		.addField('Test session ID', sessionid)
		.addField('Current date/time', dateTime)
		.addField('Note', noteforend)
		.addField('---', 'The session has ended.')
	message.client.channels.get(`683751300063690885`).send(endsessionembed);
	message.channel.send('Goodbye! :wave:')
	setTimeout(() => { process.exit()}, 5000);
	},
};