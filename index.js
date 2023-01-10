const util = require('minecraft-server-util');
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.TOKEN);

bot.command('start',(ctx)=>{
    ctx.reply('Foydalanish: `status <IP>`\nNamuna: `status mc.hypixel.net`\n',{parse_mode: 'Markdown'});
});

bot.hears(/^status / ,(ctx)=>{
    var players='';
    var initial_host=ctx.match.input.split(' ',2)[1];
    var port=initial_host.includes(':') ? initial_host.split(':',2)[1] : undefined;
    host=initial_host.includes(':') ? initial_host.split(':',2)[0] : initial_host;
    util.status(host,port? parseInt(port) : undefined).then((response)=>{
        if (response.srvRecord!==null){
            host=`${response.srvRecord.host}:${response.srvRecord.port}`
        }
        if (response.players.sample){
        for (let index = 0; index < response.players.sample.length; index++) {
            players+= '\n  '+response.players.sample[index].name;
        }}
        ctx.replyWithPhoto(
            'https://play-lh.googleusercontent.com/VSwHQjcAttxsLE47RuS4PqpC4LT7lCoSjE7Hx5AW_yCxtDvcnsHHvm5CTuL5BPN-uRTP',
            {
                caption:
                '<strong>'+response.motd.clean+'</strong>\n\n'+
                '<strong>Versiya</strong>: '+response.version.name+'\n'+
                '<strong>PING</strong>: '+response.roundTripLatency+'\n'+
                '<strong>IP</strong>: <code>'+initial_host+'</code>\n'+
                '<strong>O\'yinchilar</strong>: '+response.players.online+'/'+response.players.max+
                players,
                parse_mode: 'HTML'
            },
        );
    }).catch((error)=>{
        ctx.replyWithSticker(
            "CAACAgIAAxkBAAEHMU1jvTkD5n9TuxBZ0OBPlamGYWBjcQAC7SIAAoJT6EntwXi62UkWTi0E"
        );
        console.log(error);
    });
});

bot.launch()