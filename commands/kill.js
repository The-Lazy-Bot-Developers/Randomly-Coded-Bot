module.exports = {
	name: 'kill',
	description: 'Kills the bot, can\'t be restarted via command.',
	execute(message, args) {
		message.channel.send('Goodbye')
		await process.exit()
	},
};