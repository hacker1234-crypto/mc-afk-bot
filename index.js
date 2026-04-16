const http = require('http');
const mineflayer = require('mineflayer');

// 1. Keep the bot alive on Render
http.createServer((req, res) => {
  res.write('AFK Bot is running!');
  res.end();
}).listen(process.env.PORT || 8080);

const botOptions = {
    host: 'REGNAROKSMP.play.hosting',
    port: 25565,
    username: 'AFK'
};

function createBot() {
    const bot = mineflayer.createBot(botOptions);

    bot.on('spawn', () => {
        console.log('Bot joined! Starting Anti-Kick movements...');
        
        // 2. ANTI-AFK MOVEMENT: Prevents "Idle" kicks
        setInterval(() => {
            bot.setControlState('jump', true);
            setTimeout(() => bot.setControlState('jump', false), 500);
        }, 60000); // Jumps every 60 seconds
    });

    // 3. AUTO-AUTH
    bot.on('message', (message) => {
        const msg = message.toString().toLowerCase();
        if (msg.includes('/register')) bot.chat('/register chingyai chingyai');
        else if (msg.includes('/login')) bot.chat('/login chingyai');
    });

    // 4. STAY FOREVER REJOIN: Handles kicks AND disconnects
    bot.on('kicked', (reason) => {
        console.log('Kicked for:', reason, 'Rejoining in 5s...');
    });

    bot.on('end', () => {
        console.log('Disconnected! Reconnecting to server...');
        setTimeout(createBot, 5000); // Tries to rejoin every 5 seconds forever
    });

    bot.on('error', (err) => {
        console.log('Error:', err, 'Retrying...');
        setTimeout(createBot, 10000);
    });
}

createBot();
// SELF-PING SYSTEM
const https = require('https');
const MY_RENDER_URL = 'https://onrender.com'; 

setInterval(() => {
    https.get(MY_RENDER_URL, (res) => {
        console.log('Self-ping: Keep-alive signal sent to Render');
    }).on('error', (err) => {
        console.log('Self-ping failed: ' + err.message);
    });
}, 300000); // Pings every 5 minutes
