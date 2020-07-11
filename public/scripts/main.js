window.addEventListener("load", function () {

    document.body.width = window.width - 10;
    document.body.height = window.height - 10;

    //hide the scroll bars
    document.documentElement.style.overflow = "hidden"; // firefox, chrome
    document.body.scroll = "no"; // ie only


    var msgContainer = document.getElementById("msgContainer");
    var btnSend = document.getElementById("sendMessage");
    var lblMemUsage = document.getElementById("lblMemUsage");
    var lblServerTime = document.getElementById('lblServerTime');

   var socket = io.connect('https://krummychat.azurewebsites.net/', {
       resource: 'public/socket.io'
   });

    var theWho = document.getElementById("theWho");
    var newMessage = document.getElementById("newMessage");

    if (newMessage.addEventListener) {
        newMessage.addEventListener('keyup', newMessage_keyUp, false);
    } else if (btnSend.attachEvent) {
        newMessage.attachEvent('onkeyup', newMessage_keyUp);
    }

    function newMessage_keyUp(e) {
        if (e.keyCode == 13) {
            messageToServer();
        }
    }

    function messageToServer() {
        var who = theWho.value;
        var message = newMessage.value;
        if (who == "") {
            who = "Anon";
        }
        socket.emit("fromClient", {
            who: who,
            message: message
        });
        newMessage.value = "";
        newMessage.focus();
    }

    if (btnSend.addEventListener) {
        btnSend.addEventListener('click', messageToServer, false);
    } else if (btnSend.attachEvent) {
        btnSend.attachEvent('onclick', messageToServer);
    }

    socket.on('fromServer', function (data) {
        addMessage(data.who, data.message);
    });
    socket.on('serverPing', function (data) {
        //addMessage(data.who, data.message);
        lblServerTime.innerHTML = data.message;
    });
    socket.on('connect', function () {
        socket.emit("fromClient", {
            who: "Server",
            message: "New user connected.."
        });
        socket.emit("getMemUsage");
    });
    socket.on("showMemUsage", function(data){
        lblMemUsage.innerHTML = " RSS: " + data.rss + " | V8 Heap Total: " + data.heapTotal + " | V8 Heap Used: " + data.heapUsed;
    });

    function addMessage(who, message) {
        var m = document.createElement("div");
        m.innerHTML = "<strong>" + who + ":</strong>&nbsp;" + message;
        m.setAttribute("class", "msg");
        msgContainer.appendChild(m);
        m.scrollIntoView();
    }

    setInterval(function(){
        socket.emit("getMemUsage");
    }, 1000 * 30)
});

window.addEventListener("resize", function (event) {
    document.body.width = window.width - 10;
    document.body.height = window.height - 10;
});
