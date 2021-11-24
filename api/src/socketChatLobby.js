exports = module.exports = function(io){
    io.sockets.on('connection', function (socket) {

        socket.on('joinToGlobalChat', function (roomId) {
            console.log('Conectado al chat global con el ID: ', roomId)
            socket.join("lobby");
            const clients = io.sockets?.adapter.rooms.get(roomId);
            console.log('Clients', clients, roomId)
        })

        socket.on('lobbyMessage', function (data, isAuth) {
            if(isAuth) {
                io.to("lobby").emit('lobbyMessages', data);
                console.log('DATA:', data)
                // io.to(data.roomId).emit('lobbyMessages', { msg: `${data.name}: ${data.msg}` });
            }
            else io.to(socket.id).emit('messages', { msg: `No estas registrado no puedes enviar mensajes` });
            
        });
    
    });
}
