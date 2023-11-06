// Constantes pour les éléments du formulaire
const loginForm = document.querySelector("form");
const inputMail = document.querySelector("#email-login");
const inputPassword = document.querySelector("#password");

// Écouteur d'événement pour la soumission du formulaire
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  await login(); // Appel de la fonction de connexion
});

// Fonction asynchrone pour gérer la connexion
const login = async () => {
  try {
    // Récupération des informations du formulaire
    const userInfo = {
      email: inputMail.value,
      password: inputPassword.value
    };

    // Envoi des données de connexion au serveur
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST", // Utilisation de la méthode POST
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userInfo)
    });

    // Traitement de la réponse du serveur
    const resultat = await response.json();
    
    // Sélection des éléments d'affichage
    const pErr = document.querySelector('.erreur');
    const pValidate = document.querySelector(".validate");

    if (resultat.token) {
      // Authentification réussie
      sessionStorage.setItem("Token", resultat.token);
      pValidate.innerHTML = "Authentification réussie";

      // Redirection vers la page d'accueil après 1,5 seconde
      setTimeout(() => {
        pValidate.innerHTML = "";
        window.location.href = "index.html";
      }, 1500);
    } else {
      // Authentification échouée
      pErr.innerHTML = "Authentification échouée";

      // Redirection vers la page de connexion après 1,5 seconde
      setTimeout(() => {
        pErr.innerHTML = "";
        window.location.href = "login.html";
      }, 1500);
    }
  } catch (error) {
    console.error("Erreur lors de la connexion : ", error);
  }
};
