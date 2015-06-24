var express = require("express");

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/static'));

var server = app.listen(6767);

var io = require('socket.io').listen(server);

var users = [];
var messages = [];

io.sockets.on('connection', function (socket) {
	console.log("someone connected", socket.id);
	io.emit('update_msg_box', {messages:messages});

	socket.on('add_user', function(clientData){
		clientData.socket_id = socket.id;
		users.push(clientData);
		io.emit('update_users_list', {users:users})
	})
	socket.on('new_message', function(data){
		messages.push(data);
		io.emit('update_msg_box', {messages:messages});
	})
	socket.on('___', function(data){
		io.emit('___', users);
	})

	socket.on('disconnect', function(){
		console.log('someone bounced', socket.id);
		for(index in users){
			if(socket.id == users[index].socket_id)
			{
				users.splice(index,1);
				break;
			}
		}
		io.emit('update_users_list', {users:users});
	});
});
