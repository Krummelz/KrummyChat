//load the required modules
var express = require('express');
var http = require('http');

//init our expressJS application
var app = express();
//start an HTTP server with the express application variable
var server = http.createServer(app);

//set up the socketIO and tell it to listen on the http server
var io = require('socket.io').listen(server);

//tell express to automatically serve static files in the public directory
app.use(express.static(__dirname + '/public'));

io.configure(function () {
    //io.set('transports', [ 'websocket' ]);
    //if (process.env.IISNODE_VERSION) {
    io.set('resource', '/public/socket.io');
    //}
});

//var heapdump = require('heapdump');
//var nextMBThreshold = 16;
//
//setInterval(function () {
//    console.log("checking memory usage");
//    var memMB = process.memoryUsage().rss / 1048576;
//    console.log("memMB is", memMB);
//    if (memMB & nextMBThreshold) {
//        heapdump.writeSnapshot();
//        nextMBThreshold += 16;
//        console.log("write snapshot and increment threshold");
//    }
//}, 6000 * 2);

io.sockets.on('connection', function (socket) {
    socket.on('fromClient', function (data) {
        io.sockets.emit('fromServer', {
            who: data.who,
            message: data.message
        });
    });
    socket.on("getMemUsage", function () {
        var mem = process.memoryUsage();
        io.sockets.emit("showMemUsage", {
            rss: Math.floor(mem.rss / 1000),
            heapTotal: Math.floor(mem.heapTotal / 1000),
            heapUsed: Math.floor(mem.heapUsed / 1000)
        });
        console.log(mem);
    });
});

setInterval(function(){

  io.sockets.emit('fromServer', {
      who: 'SERVER',
      message: 'ping'
  });

}, 5000);

server.listen(process.env.PORT || 8080);
