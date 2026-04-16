const http = require('http');
const https = require('https');
const mineflayer = require('mineflayer');

// 1. STABLE WEB SERVER (Tricks Render into staying alive)
const MY_URL = 'https://onrender.com';
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bot is standing guard!\n');
});

server.listen(process.env.PORT || 8080, () => {
    console.log('Web server is ready.');
});

// SELF-PING: Every 5 minutes to stay ahead of Render's 15-min sleep
setInterval(() => {
    https.get(MY_URL, (res) => {
        console.log('Heartbeat sent to Render.');
    }).on('error', (e) => console.log('Heartbeat failed.'));
}, 300000);

// 2. MINECRAFT BOT SETTINGS
const botOptions = {
    host: 'REGNAROKSMP.play.hosting',
    port: 25565,
    username: 'Regnarok_Bot',
    version: false // This lets the bot auto-detect the Minecraft version
};

function createBot() {
    console.log('Attempting to join the server...');
    const bot = mineflayer.createBot(botOptions);

    // 3. HUMAN-LIKE MOVEMENTS (To bypass AFK Detectors)
    bot.on('spawn', () => {
        console.log('Bot is in the world.');
        
        setInterval(() => {
            if (!bot.entity) return;
            
            // Randomly pick an action: Jump, Look, or Walk
            const action = Math.floor(Math.random() * 3);
            if (action === 0) {
                bot.setControlState('jump', true);
                setTimeout(() => bot.setControlState('jump', false), 500);
            } else if (action === 1) {
                bot.look(Math.random() * 6.28, (Math.random() - 0.5) * 1.5);
            } else {
                bot.setControlState('forward', true);
                setTimeout(() => {
                    bot.setControlState('forward', false);
                    bot.setControlState('back', true);
                    setTimeout(() => bot.setControlState('back', false), 500);
                }, 500);
            }
        }, 45000); // Does a random action every 45 seconds
    });

    // 4. AUTO-AUTH (AuthMe / Login)
    bot.on('message', (message) => {
        const msg = message.toString();
        console.log('Server:', msg); // This shows server messages in your Render logs
        
        if (msg.includes('/register')) {
            bot.chat('/register chingyai chingyai');
        } else if (msg.includes('/login')) {
            bot.chat('/login chingyai');
        }
    });

    // 5. THE "NEVER GIVE UP" RECONNECT
    bot.on('end', (reason) => {
        console.log(`Bot disconnected: ${reason}. Rejoining in 20s...`);
        setTimeout(createBot, 20000);
    });

    bot.on('error', (err) => {
        console.log('Error encountered. Rejoining...');
        setTimeout(createBot, 20000);
    });
}

createBot();
