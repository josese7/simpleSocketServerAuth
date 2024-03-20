const myForm = document.querySelector('form');

const url = `http://localhost:8080/api/auth/`


myForm.addEventListener('submit', e => {
   e.preventDefault();

   const formData = {}

   for(let elem of myForm.elements){
      if(elem.name.length > 0){
         formData[elem.name] = elem.value
      }
   }
   console.log(formData)
   fetch(url + "login",{
      method:'POST',
      headers:{
         'Content-Type':'application/json'
      },
      body: JSON.stringify(formData)
   })
   .then(resp => resp.json())
   .then(({msg, token, user}) => {

      if(msg){
         return console.error(msg)
      }
      localStorage.setItem('email', user.email)
      localStorage.setItem('token', token)
      console.log(user.email, token)
      window.location='chat.html'
   })
   .catch(e=>{
      console.log("Cacht", e)
   })
})
function handleCredentialResponse(response) {
    // decodeJwtResponse() is a custom function defined by you
    // to decode the credential response.
    //const responsePayload = decodeJwtResponse(response.credential);
     //Google Token : ID_TOKEN
     const body = {id_token: response.credential}
     console.log(response)
     fetch(url + "google",{
        method:'POST',
        headers:{
           'Content-Type':'application/json'
        },
        body: JSON.stringify(body)
     })
     .then(resp => resp.json())
     .then( resp => {
        console.log('Resp', resp)
        localStorage.setItem('email', resp.user.email)
        localStorage.setItem('token', resp.token)
        window.location='chat.html';
     })
     .catch(console.warn)
    /* console.log("ID: " + responsePayload.sub);
    console.log('Full Name: ' + responsePayload.name);
    console.log('Given Name: ' + responsePayload.given_name);
    console.log('Family Name: ' + responsePayload.family_name);
    console.log("Image URL: " + responsePayload.picture);
    console.log("Email: " + responsePayload.email); */
 }

 const button = document.getElementById('google_signout')
 button.onclick = () => {

     console.log(google.accounts.id)
     google.accounts.id.disableAutoSelect()

     google.accounts.id.revoke( localStorage.getItem('email'), done  => {

        localStorage.clear();
        location.reload();
     });
 }