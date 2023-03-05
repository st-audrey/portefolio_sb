async function logUser(e){
    e.preventDefault();

    let error = document.getElementById("error");
    let user = {
        email : document.getElementById("email").value,
        password : document.getElementById("password").value
    }
  
  let response = await fetch('http://localhost:5678/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(user)
  });
  
  let result = await response.json();

  if(result.userId){

    localStorage.setItem("token", result.token);
    localStorage.setItem("user_id", result.userId);
    window.location.href="/index.html";

  }else if(result.message){
    error.innerHTML = "Erreur dans l’identifiant ou le mot de passe"
  }
}

document.getElementById("form-login").addEventListener("submit", logUser);





  