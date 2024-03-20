
let user = null;
let socket = null;
//HTML References

const txtUid        = document.querySelector('#txtUid')
const txtMensaje    = document.querySelector('#txtMensaje')
const ulUsers       = document.querySelector('#ulUsers')
const ulMensaje     = document.querySelector('#ulMensaje')
const btnOut        = document.querySelector('#btnOut')


//Validate token for CHAT
const validarJWT = async () => {

    try {
        const token = localStorage.getItem('token') || null

        if (!token) {
            window.location = 'index.html'
            throw new error('Sin token')
        }

        const resp = await fetch(`http://localhost:8080/api/auth/`, {
            headers: { 'x-token': token }
        })

        const { user: userData, token: xtoken } = await resp.json()

        //console.log(user, xtoken)
        user = userData
        localStorage.setItem('token', xtoken)
        document.title = user.name
        //Connect Socket
        await connectSocket();

    } catch (error) {
        console.error(error)
    }
}

const connectSocket = () => {
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });
    //When the Server Socket is online
    socket.on('connect',()=>{
        console.log('Chat online')
    })
    socket.on('disconnect',()=>{
        console.log('Chat offline')
    })

    socket.on('receive-messages', (payload)=>{
       
        showMessagess(payload)
    })
    socket.on('active-users', (payload)=>{ //or  socket.on('active-users',showUsers)
       
       showUsers(payload)
    })
    socket.on('private-message', (payload)=>{
        //TODO:
        console.log(payload)
    })
}
//const socket = io()

const showUsers = (users = [])=>{
    let usersHtml = '';

    users.forEach(({name, uid}) => {
        
        usersHtml += `
        <li>
        <p>
        <h5 class="text-success"> ${ name }</h5>
        <span class="fs-6 text-muted">${uid}</span>
        </p>
        </li>
        `
    })
    ulUsers.innerHTML = usersHtml;
}

const showMessagess = (messagges = [])=>{
    let messaggesHtml = '';

    messagges.forEach(({name, message}) => {
        
        messaggesHtml += `
        <li>
        <p>
        <span class="text-primary"> ${ name } :</span>
        <span class="fs-6 text-muted">${message}</span>
        </p>
        </li>
        `
    })
    ulMensaje.innerHTML = messaggesHtml;
}
btnOut.addEventListener('click', ()=> {
    console.log('logout', socket)
    socket.disconnect()
    localStorage.clear()
    //window.location = 'index.html'
})
txtMensaje.addEventListener('keyup', (ev) =>{ //keyup => Enter
    //console.log(ev.keyCode)
    const message = txtMensaje.value;
    const uid = txtUid.value;
    if(ev.keyCode !== 13) return;
    
    if(message.length ===0 ) return;
    
    txtMensaje.value= ''
    //console.log(message, ev)
    socket.emit('send-message', {message, uid})

})
const main = async () => {
    await validarJWT()

}

main();
