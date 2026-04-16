const http = require('http');
const https = require('https');
const mineflayer = require('mineflayer');

// 1. WEB SERVER (Keeping Render Awake)
const MY_URL = 'https://onrender.com';
http.createServer((req, res) => {
  res.write('Status: Online');
  res.end();
}).listen(process.env.PORT || 8080);

// SELF-PING SYSTEM
setInterval(() => {
  https.get(MY_URL, (res) => {}).on('error', (e) => console.log('Ping failed'));
}, 240000); // 4 minutes

// 2. BOT SETTINGS
const botOptions = {
    host: 'REGNAROKSMP.play.hosting',
    port: 25565,
    username: 'Regnarok_Bot',
    hideErrors: true
};

function createBot() {
    const bot = mineflayer.createBot(botOptions);

    bot.on('spawn', () => {
        console.log('Bot is in!');
        
        // 3. THE "REAL PLAYER" LOOP
        setInterval(() => {
            if (!bot.entity) return;
            
            // Randomly jump, swing arm, and look around
            bot.setControlState('jump', true);
            bot.swingArm('right'); 
            bot.look(Math.random() * 6, (Math.random() - 0.5) * 1);
            
            setTimeout(() => {
                bot.setControlState('jump', false);
            }, 500);
        }, 30000); // Does this every 30 seconds
    });

    // 4. AUTO LOGIN / REGISTER
    bot.on('message', (message) => {
        const msg = message.toString().toLowerCase();
        if (msg.includes('/register')) bot.chat('/register chingyai chingyai');
        if (msg.includes('/login')) bot.chat('/login chingyai');
    });

    // 5. THE ULTIMATE REJOIN
    bot.on('end', () => {
        console.log('Kicked! Rejoining in 30 seconds...');
        setTimeout(createBot, 30000); 
    });

    bot.on('error', () => {
        setTimeout(createBot, 30000);
    });
}

createBot();
