const express = require("express");
const path = require("path");

const app = express();
const server = require("http").createServer(app);

const io = require("socket.io")(server);


app.use(express.static(path.join(__dirname+"/public")));

io.on("connection",function(socket){
    /*socket.on('join',function(room) {
    socket.join(room);
    console.log('joined room '+room);
    });*/
    /*socket.on('message', (msg, room) => {
    io.to(room).emit('message', msg);
    });*/
    socket.on("newuser",function(username){
        socket.broadcast.emit("update", username + " se unió a la partida");
    });
    socket.on("exituser",function(username){
        socket.broadcast.emit("update", username + " abandonó la partida");
    });
    socket.on("chat",function(message){
        socket.broadcast.emit("chat",message);
    });
    socket.on("diceroll",function(username,abilityresult,skillresult, toolresult){
        socket.broadcast.emit("diceroll","",abilityresult,skillresult, toolresult );
        //console.log(diceroll);
    });
});

server.listen(5000, 'localhost', function(){
    console.log("toy en el 5000 panita")
});