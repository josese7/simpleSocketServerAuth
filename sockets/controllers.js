const { Socket } = require("socket.io")
const { checkToken } = require("../helpers/generate-jwt")
const {ChatMessages} = require('../models')

const chatMessages = new ChatMessages()

// Remove socket type for production
const socketController = async ( socket = new Socket(), io ) =>{

    //Then we get the token
    //console.log('cliente conectado', socket.handshake.headers['x-token'])
    const token = socket.handshake.headers['x-token']

    const user = await checkToken(token)

    if(!user){
        return socket.disconnect();
    }
    //Add connected user
    chatMessages.connectUser(user)
    console.log('Controller Connect', user)

    //Send users and chat history
    io.emit('active-users', chatMessages.usersArr ) //Rather broadcast, io is all users in the socket server
    socket.emit('receive-messages', chatMessages.last10)
    //console.log('Cliente conectado', user.name)


    //Join special chat

    socket.join(user.id);




    // Clear When someone disconnects from the server socket.
    socket.on('disconnect', ()=>{
        console.log('Desconectar usuario', user)
        chatMessages.desconnectUser(user.id)
        io.emit('active-users', chatMessages.usersArr )

    })

    socket.on('send-message', ({uid, message})=>{


        console.log(message, user.id)

        if(uid){
            //Private Chat
            socket.to(uid).emit('private-message',{from: user.name, message})
            
        }else{ //Group Chat

            chatMessages.sendMessage(user.id, user.name, message )
            io.emit('receive-messages', chatMessages.last10)
        }
    })
}

module.exports = {
    socketController
}