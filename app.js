var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

//tell express to automatically serve static files in the public directory
app.use(express.static(__dirname + '/public'));


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

io.on('connection', (socket) => {
    console.log(' a user connected');
    socket.on('fromClient', (data) => {
        io.emit('fromServer', {
            who: data.who,
            message: data.message
        });
    });
    socket.on("getMemUsage", () => {
        var mem = process.memoryUsage();
        io.emit("showMemUsage", {
            rss: Math.floor(mem.rss / 1000),
            heapTotal: Math.floor(mem.heapTotal / 1000),
            heapUsed: Math.floor(mem.heapUsed / 1000)
        });
    });
});

setInterval(() => {

    io.emit('serverPing', {
        who: 'SERVER',
        message: new Date().toISOString()
    });

}, 60000);

io.emit('serverPing', {
    who: 'SERVER',
    message: new Date().toISOString()
});

http.listen(8080, () => {
    console.log("server listening on port 8080");
});
