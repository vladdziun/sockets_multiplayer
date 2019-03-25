var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(1337,'127.0.0.1')

var express = require("express");
// var app = express();
// const server = app.listen(1337);
// const io = require('socket.io')(server)

var path = require("path");
// app.use(express.static(path.join(__dirname, "./static")));
app.use(express.static(path.join(__dirname, "./static")));

var players = {};

io.on('connection', function (socket) { //2

    var player = {
        x: 1,
        y: 1,
        id: socket.id
    }

    players[socket.id] = player;
    console.log("created player with id - ",socket.id )
    // console.log("all players - ", players)

    socket.emit('new_user',player);

    socket.broadcast.emit('all_players', players)
    socket.emit('all_players', players)

    socket.on('disconnect', function(){
        console.log("deleted user", players[socket.id])
        delete_package = {
            players: players,
            deleted_user: players[socket.id]
        }
        io.emit('disconnect', delete_package)
        delete players[socket.id] 
    })

    socket.on('moved_player', function(data){
        players = data
        console.log(players)
        io.emit('updated_positions', players)
    })

    

});

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render("index");
})

//inet - 192.168.1.165