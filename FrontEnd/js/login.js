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
                    throw new Error("Bad response from server")
        }
            return response.json()
        }).then((response) => {
    
            localStorage.setItem("token", response.token)
            localStorage.setItem("user_id", response.userId)
            
            window.location.href="index.html";

    }).catch((error) => {
        // console.log(error)
    });
}








  