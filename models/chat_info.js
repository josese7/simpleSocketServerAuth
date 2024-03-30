class Message{
    constructor(uid, name, message, date){
        this.uid = uid;
        this.message = message;
        this.name = name;
        this.date = date;
    }
}

class ChatMessages {
    constructor(){
        this.messages = [];
        this.users = {};
    }
    
    get last10(){
        this.messages = this.messages.splice(0,10);
        return this.messages;
    }
    get usersArr(){
        return Object.values(this.users);
    }


    sendMessage(uid, name, message){
        const date = new Date().getTime()
        this.messages.unshift( new Message(uid, name, message, date))
    }

    connectUser(user){
        this.users[user.id] = user
        console.log("Connect user from Class", this.users)
    }

    desconnectUser(uid){
        delete this.users[uid]
    }
}

module.exports = ChatMessages