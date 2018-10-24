var http = require('http');
var request=require('request');
const port = 8080;

// creation du serveur http
var server = http.createServer(function(req, res) {
 
        res.end("<h1>Bienvenu sur le serveur de websocket </h1>");
    });

// creation du websocket basé sur le serveur http ci dessus
var io = require('socket.io').listen(server) 

exports.serveur=function(){
// Chargement du fichier index.html affiché au client

server.listen(port,  () => { 
    console.log("Server linstening on ", port);
    
});
}
// Chargement de socket.io

exports.Messages=function(){
io.sockets.on('connection', function (socket, id) {
    // Quand un client se connecte, on lui envoie un message
    socket.emit('info', 'Vous êtes bien connecté !');
    // On signale aux autres clients qu'il y a un nouveau venu
    socket.broadcast.emit('info', 'Un autre client vient de se connecter ! ');
   

    // Dès qu'on nous donne un pseudo, on le stocke en variable de session
    socket.on('identifiant', function(id) {
        socket.id = id;
    });

    // Dès qu'on reçoit un "message" (clic sur le bouton), on le note dans la console
       
        socket.on('userPosition', function(coordo) {
            console.log(coordo);

            // pour debug

            //var payload = JSON.parse('{"MysqlId":"02","pseudo":"Munick","avatar":"http://avatar.fr/03.jpg","coordinates":{"longitude":"1.45245","latitude":"43.6191232"}}');
            // pour prod
            var payload = JSON.parse(coordo);

            postUser(payload, socket);

        });
});}


var getAll=function(socket){

    var headers = {
        'User-Agent':       'Super Agent/0.0.1',
        'Content-Type':     'application/x-www-form-urlencoded'
    }
    
    // Configure the request

    var gets = {
        url: 'http://localhost:8082/gps/select/all/last',
        method: 'GET',
        headers: headers,
       
    }
    
    // Start the request
    request(gets, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // Print out the response body
            console.dir(JSON.parse(body));
           socket.broadcast.emit('usersLastPosition', body);
        }
    })
    
    };

// récupère le json en fonction du pseudo
var getUser=function(socket){

    var headers = {
        'User-Agent':       'Super Agent/0.0.1',
        'Content-Type':     'application/x-www-form-urlencoded'
    }
    
    // Configure the request
    var gets = {
        url: 'http://localhost:8082/gps/select/'+pseudo+'',
        method: 'GET',
        headers: headers,
       
    }
    
    // Start the request
    request(gets, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // Print out the response body
            console.dir(JSON.parse(body));
           socket.broadcast.emit('targetUser', body);
        }
    })
    
    };
    
    // insère une position en fonction de ce que recoit le websocket
    var postUser=function(payload, socket){

    var headers = {
        'User-Agent':       'Super Agent/0.0.1',
        'Content-Type':     'application/json'
    }
    
    // Configure the request
    var posts = {
        url: 'http://nodejs2.afpa-balma.fr/gps/create',
        method: 'POST',
        headers: headers,
        json: payload
    }
    
    // Start the request
    request(posts, function (error, response,result) {
        if (!error && response.statusCode == 200) {
            // Print out the response body
            console.log(result);
            getAll(socket);
        } else { 
            console.log("Erreur d'insertion de position");
        }
    });
    }
    