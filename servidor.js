var servidor = require('socket.io').listen(7873);
servidor.set('log level', 0);

var user = {}, usuarios = {};

servidor.sockets.on('connection', function(socket){

	var iden = socket.id;
	servidor.sockets.emit('online', usuarios);

	socket.on('entro', function(user){
		var n = user.name;
		user = {
			nombre: user.name,
			fbID: user.id,
			iden: iden,
			foto: "https://graph.facebook.com/" + user.id + "/picture",
			perfil: user.link
		}
		socket.username = n;
		usuarios[n] = user;
		servidor.sockets.socket(socket.id).emit('entraste', user);
		servidor.sockets.emit('entro', user);
		servidor.sockets.emit('online', usuarios);
		console.log('Entro: ' + n);
	});

	socket.on('winFocus', function(e) {
		if(socket.username != null){
			servidor.sockets.emit('winFocus', e);
		}
	});

	socket.on('visto', function(e) {
		if(socket.username != null){
			servidor.sockets.emit('visto', e);
		}
	});

	socket.on('disconnect', function () {
		if(socket.username != null){
			delete usuarios[socket.username];
			servidor.sockets.emit('salio', socket.username);
			servidor.sockets.emit('online', usuarios);
			console.log('Salio: ' + socket.username);
		}
	});

	socket.on('enviar', function (res) {
		if(socket.username != null){
			// Ponemos un filtro "AntiDante"
			var texto = res.texto.replace(/</g, '&lt;').replace(/>/g, '&gt;');
			linea = {
				nombre: res.nombre,
				texto: texto
			}
			servidor.sockets.emit('enviando', linea);
			console.log(res.nombre + ' dice: ' + res.texto);
		}
	});

	socket.on('escribiendo', function(res){
		if(socket.username != null){
			servidor.sockets.emit('escribiendo', res);
		}
	});

	socket.on('privado', function(privado){
		if(socket.username != null){
			if(typeof usuarios[privado.para] != "undefined"){
				servidor.sockets.socket(usuarios[privado.para].iden).emit('privado', privado);
				console.log('DM de ' + privado.de + ' para ' + privado.para + ': ' + privado.texto);
			}
		}
	});
});