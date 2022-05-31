const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ding')
		.setDescription('Replies with Dong!!!'),
	async execute(interaction) {
		// interaction.reply(`Сердцебиение веб-сокета: ${interaction.client.ws.ping}ms.`);
		const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
		await interaction.editReply(`@Jeferson @fabiofariasw o ripa é...: ${sent.createdTimestamp - interaction.createdTimestamp}ms`);
	},
};