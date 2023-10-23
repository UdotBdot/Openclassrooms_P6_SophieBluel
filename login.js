// Login
const loginForm = document.querySelector("form");
const inputMail = document.querySelector("#email-login");
const inputPassword = document.querySelector("#password");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  login();
})

const login = async () => {

  const userInfo = {
    email: inputMail.value,
    password: inputPassword.value
  };

  await fetch("http://localhost:5678/api/users/login", {
    method: "post",
    headers: {
      "content-Type": "application/json"
    },
    body: JSON.stringify(userInfo)
  })
    .then((response) => response.json())

    .then((resultat) => {
      const pErr = document.querySelector('.erreur')
      const pValidate = document.querySelector(".validate")
      if (resultat.token) {
        sessionStorage.setItem("Token", resultat.token);
        pValidate.innerHTML = "Authentification réussie"
        setTimeout(() => {
          pValidate.innerHTML = ""
          window.location.href = ("index.html")
        }, 1500)
      } else {
        pErr.innerHTML = "Authentification à échoué"
        setTimeout(() => {
          pErr.innerHTML = ""
          window.location.href = ("login.html")
        }, 1500)
      }

    })
}