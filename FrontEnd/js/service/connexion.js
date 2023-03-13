async function logUser(e){

    e.preventDefault()

    let error = document.getElementById("error");
    let user = {
        email : document.getElementById("email_login").value,
        password : document.getElementById("password_login").value
    }

    await fetch('http://localhost:5678/api/users/login', { 
            method: 'POST',
            headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
            body: JSON.stringify(user)})
        .then((response) => {
            if (response.status == 404 || response.status == 401 || response.message) {
                error.innerHTML = "Erreur dans l\'identifiant ou le mot de passe"
                throw new Error("Client error response : Not found or unauthorized")
            }else if (response.status > 499 && response.status < 600){
                error.innerHTML = "Erreur de Serveur : nous travaillons actuellement afin <br> de résoudre le problème de connexion."
                throw new Error("Servor error responses")
            }
            return response.json()
        }).then((response) => {
    
            localStorage.setItem("token", response.token)
            localStorage.setItem("user_id", response.userId)
            
            window.location.href="index.html";

    }).catch((error) => {
        console.warn('Something went wrong with login', error);
    });
}

function logout(){
    localStorage.clear()
    document.getElementById('login-link-li').classList.remove("hide")
    document.getElementById('logout-link-li').classList.add("hide")
    window.location.href="index.html"
}








  