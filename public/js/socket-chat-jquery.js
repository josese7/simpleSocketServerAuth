var params = new URLSearchParams(window.location.search);

var nombre = params.get('nombre');
var sala = params.get('sala');


// referencias de jQuery
var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar');
var txtMensaje = $('#txtMensaje');
var divChatbox = $('#divChatbox');


// Funciones para renderizar usuarios
function renderizarUsuarios(personas) { // [{},{},{}]

    console.log(personas);

    var html = '';

    html += '<li>';
    html += '    <a href="javascript:void(0)" class="active"> Chat de <span> ' + "Grupo" + '</span></a>';
    html += '</li>';

    for (var i = 0; i < personas.length; i++) {

        html += '<li>';
        html += '    <a data-id="' + personas[i].uid + '"  href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + personas[i].name + ' <small class="text-success">online</small></span></a>';
        html += '</li>';
    }

    divUsuarios.html(html);

}

//FIXME: Notifycations 
function renderizarMensajes(messages, yo) {
    var html = '';
   
    
    //console.log("Chat grupal",messages, hora, yo)
    var adminClass = 'info';
    messages.forEach(({name, message, date}) => {
        if (name === 'Administrador') {
            adminClass = 'danger';
        }
        var fecha = new Date(date);
        var hora = fecha.getHours() + ':' + fecha.getMinutes();
        if (yo) {


            html += '<li class="reverse">';
            html += '    <div class="chat-content">';
            html += '        <h5>' + name + '</h5>';
            html += '        <div class="box bg-light-inverse">' + message + '</div>';
            html += '    </div>';
            html += '    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
            html += '    <div class="chat-time">' + hora + '</div>';
            html += '</li>';
    
        } else {
    
            html += '<li class="animated fadeIn">';
    
            if (name !== 'Administrador') {
                html += '    <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
            }
    
            html += '    <div class="chat-content">';
            html += '        <h5>' + name + '</h5>';
            html += '        <div class="box bg-light-' + adminClass + '">' + message + '</div>';
            html += '    </div>';
            html += '    <div class="chat-time">' + hora + '</div>';
            html += '</li>';
    
        }
    
    })
    
    divChatbox.append(html);

}

function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}




// Listeners
divUsuarios.on('click', 'a', function() {

    var id = $(this).data('id');

    if (id) {
        console.log(id);
    }

});

formEnviar.on('submit', function(e) {

    e.preventDefault();

    if (txtMensaje.val().trim().length === 0) {
        return;
    }

    socket.emit('send-message', {
        name: nombre,
        message: txtMensaje.val()
    }, function(mensaje) {
        txtMensaje.val('').focus();
        renderizarMensajes(mensaje, true);
        scrollBottom();
    });


});