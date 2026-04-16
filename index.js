const http = require('http');
const mineflayer = require('mineflayer');

// 1. Keep the bot alive on Render
http.createServer((req, res) => {
  res.write('AFK Bot is running!');
  res.end();
}).listen(process.env.PORT || 8080);

const botOptions = {
    host: 'REGNAROKSMP.play.hosting', // Corrected IP
    port: 25565,
    username: '.t'
};

function createBot() {
    const bot = mineflayer.createBot(botOptions);

    bot.on('login', () => {
        console.log('Bot logged into the server!');
    });

    // 2. AUTO-AUTH SYSTEM (Register/Login)
    bot.on('message', (message) => {
        const msg = message.toString().toLowerCase();
        
        // If the server asks to register
        if (msg.includes('/register')) {
            console.log('Registering with password: chingyai');
            bot.chat('/register chingyai chingyai');
        } 
        // If the server asks to login
        else if (msg.includes('/login')) {
            console.log('Logging in with password: chingyai');
            bot.chat('/login chingyai');
        }
    });

    // 3. AUTO-RECONNECT (Stay forever)
    bot.on('end', () => {
        console.log('Disconnected. Reconnecting in 10 seconds...');
        setTimeout(createBot, 10000); 
    });

    bot.on('error', (err) => {
        console.log('Error encountered:', err);
        setTimeout(createBot, 10000);
    });
}

createBot();
