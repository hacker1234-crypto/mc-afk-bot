const http = require('http');
const mineflayer = require('mineflayer');

// This keeps the bot alive on Render
http.createServer((req, res) => {
  res.write('AFK Bot is running!');
  res.end();
}).listen(process.env.PORT || 8080);

const bot = mineflayer.createBot({
  host: 'REGNAROKSMP.play.hosting', 
  port: 25565,
  username: 'Regnarok_Bot' 
});

bot.on('login', () => console.log('Bot is in the server!'));
bot.on('kicked', (reason) => console.log('Kicked for: ' + reason));
bot.on('error', (err) => console.log(err));

// Auto-reconnect if it gets disconnected
bot.on('end', () => {
    console.log('Disconnected. Retrying in 10s...');
    setTimeout(() => { process.exit(); }, 10000); // Forces Render to restart it
});

