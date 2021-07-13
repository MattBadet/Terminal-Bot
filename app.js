const Discord = require("discord.js")
const bot = new Discord.Client();

var fs = require('fs');
var http = require('http').createServer(function (req, res) {
    fs.readFile(__dirname + '/index.html',
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }

            res.writeHead(200);
            res.end(data);
            console.log("initialising . . .")
        }
    );
});
var io = require('socket.io')(http);

http.listen(process.env.PORT);

io.on('connection', function (socket) {
    console.log("user connected")
    socket.emit('welcome', { message: 'Vous êtes connecté au terminal !' });
    socket.on('message', function (data) {
        console.log('Message: ' + data);
        socket.broadcast.emit('message', { message: data });
    });
    socket.on('message', function (data) {
        if (data == "hello") {
            socket.emit('message', { message: 'Hello mec' });
            console.log('réponse hello');

        }
        if (data == "--start") {
            alubot(socket)
        }
        if (data == "--stop") {
            etein(socket)
        }
        if (data == "--restart") {
            restartbot(socket)
        }
        let splitmessage = data.split(' ')
        console.log(splitmessage)
        if (splitmessage[0] == 'say') {
            pseudo = splitmessage[1]
            channel = splitmessage[2]
            mes = splitmessage[3]
            msg = "(console) : " +pseudo + " : " + mes
            console.log(mes)
            socket.emit('message', { message: mes })
            console.log('test')
            bot.channels.cache.find(chan => chan.name == channel).send(msg)
        }
    });
});

function alubot(socket) {    
    try{
        
        bot.login('Nzk2MDYyMTc0MTI3NTg3MzQ5.X_ScrA.RxUSF187qxdMEb9Lw0CvQUd2pds');

        bot.on('ready', function () {
            bot.user.setPresence({ game: { name: 'Il vous voit !' } });
            console.log("Bot is working !");
            socket.emit('message', { message: '-----------------Bot Allumé-----------------' })
        });

        bot.on('message', function (message) {
            if (message.content === "ping") {
                message.channel.send(message.author.username + " pong")
                console.log('ping pong');
            }
        })

        bot.on('message', function (message) {
            if (message.content === "--stop") {
                etein()
                console.log('bot étein');
            }
        })

        bot.on('message', function (message) {
            if (message.content === "--restart") {
                resetBot()
                console.log('bot restart');
            }
        })

        bot.on("message", function (message) {
               
        })

        bot.on('message', function(message) {
            var msg = message.channel.name + '>' + message.author.username + ':' + message.content;
            console.log(msg);
            socket.emit('message', { message: msg });
            
        });
    } catch(error){
        document.write(error);
    }

}

function etein(socket) {
    bot.destroy();
    socket.emit('message', { message: '-----------------Bot Etein-----------------'})
}

function restartbot(socket) {
    socket.emit('message', { message: '-----------------Redémarrage du Bot-----------------' })
    etein();
    alubot();
}




