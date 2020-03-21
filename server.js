var Game = require('./game');
var server = require('http').createServer();
var io = require('socket.io')(server);
var Player = require('./player');

// var revealedCard = [];
// var deck = [];
// var roles = [];
// var nbPlayer;
// var gameType;
var gameTypeAvailable = new Map();
// var playerTurn;
var players = [];
var sockets = [];
// var currentTurn;
// var nbTurnLeft;
// var wireLeft;
// var emptyLeft;
// var bombLeft;
// var cardRevealedThisTurn;




// This defines the port that we'll be listening to
server.listen(3000);
console.log ('Server Started');

let game = new Game();
var gameTypeAvailable = game.initGame();
console.log("Game created");
console.log("Gametype avalaible : ", gameTypeAvailable);

// "Listens" for client connections
io.sockets.on('connection', function(socket)
{
	console.log('User connected: ' + socket.id);
	socket.emit('connectionEstabilished', {id: socket.id}); // retourn l'id de cette session

    socket.on('register', (playerName) => {
        console.log('User logged: ' + socket.id);
		
        let player = new Player(playerName, socket);

        game.addPlayer(player);
        players[socket.id] = player; // Ajouter la liste de joueur a la game.

        console.log("Player : ", socket.id, " is connected to the game.")
        socket.broadcast.emit('playerConnection', player.username); // previens les autres utilisateurs
        for(let id in players) {
            if (id != socket.id) {                
                socket.emit('playerConnection', players[id].username); // envoi la liste des autres utilisateurs
            }
        }
    });
    
    socket.on('logUser', () => {
        console.log("CURRENT PLAYERS REGISTERED");
        console.log(players);
    })

    socket.on('disconnect',() => {
        console.log('User disconnected: ' + socket.id);
        delete players[socket.id];
        delete socket[socket.id];
        socket.broadcast.emit('playerDisconnection', {id: socket.id}); 
    });

    socket.on('startGame', function (data) {
        game.startGame(players);
    });

    // socket.on("revealCard", function (data) {
    // });

    // function revealCard(target) {
    //     io.emit('revealCard', target);
    //     io.emit('giveToken', target);
    // }
});
