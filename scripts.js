// Constante pour l'URL de l'API
const apiUrl = "http://localhost:5678/api/works";
const galleryEl = document.querySelector(".gallery");
let data = [];

// Fonction asynchrone pour récupérer les données depuis l'API
async function fetchData() {
  try {
    const response = await fetch(apiUrl);
    data = await response.json();
    renderData(data);
    createGallery(data);
  } catch (error) {
    console.error("Erreur lors de la récupération des données : ", error);
  }
}

// Fonction pour afficher les données dans la galerie
function renderData(data) {
  galleryEl.innerHTML = "";
  data.forEach(item => {
    const newFigure = document.createElement("figure");
    const newImg = document.createElement("img");
    newImg.src = item.imageUrl;
    const newFigCaption = document.createElement("figcaption");
    newFigCaption.textContent = item.title;
    newFigure.appendChild(newImg);
    newFigure.appendChild(newFigCaption);
    galleryEl.appendChild(newFigure);
  });
}

// Écouteurs d'événements pour les filtres de la galerie
const allEl = document.getElementById("all");
const objEl = document.getElementById("obj");
const appartEl = document.getElementById("appart");
const hotRestauEl = document.getElementById("hot-restau");

allEl.addEventListener('click', () => {
  renderData(data);
});

objEl.addEventListener('click', () => {
  const filteredData = data.filter(item => item.category.name === "Objets");
  renderData(filteredData);
});

appartEl.addEventListener('click', () => {
  const filteredData = data.filter(item => item.category.name === "Appartements");
  renderData(filteredData);
});

hotRestauEl.addEventListener('click', () => {
  const filteredData = data.filter(item => item.category.name === "Hotels & restaurants");
  renderData(filteredData);
});

// Écouteur d'événement pour le chargement du document
document.addEventListener("DOMContentLoaded", () => {
  fetchData();
});

// Modale - Ouverture et Fermeture
const modalContainer = document.querySelector(".modal-container");
const modalTriggers = document.querySelectorAll(".modal-trigger");
const openModal = document.getElementById("open-modal");

modalTriggers.forEach(trigger => trigger.addEventListener("click", toggleModal));

function toggleModal() {
  modalContainer.style.display = "none"; // Fermer la modale
}

openModal.addEventListener("click", function () {
  modalContainer.style.display = "block"; // Ouvrir la modale
});

// Ajout dynamique des photos dans la modale
function createGallery(data) {
  const modalGallery = document.querySelector(".modal-gallery");
  modalGallery.innerHTML = ""; // Effacer le contenu existant

  data.forEach((item) => {
    const figure = document.createElement("figure");
    figure.innerHTML = `
      <div class="trash" id="${item.id}">
        <i class="fa-solid fa-trash-can" id="${item.id}"></i>
      </div>
      <img src="${item.imageUrl}" alt="">
    `;
    modalGallery.appendChild(figure);
  });
  const trashIcons = document.querySelectorAll(".trash");
  trashIcons.forEach(trashIcon => {
  trashIcon.addEventListener("click", () => {
    console.log("J'ai cliqué");
     // Ajoutez ici le code à la place du console.log pour supprimer l'élément associé à l'icône trash.
  });
});
}

// Gestion de la session utilisateur
const tokenSession = sessionStorage.getItem("Token");
const refreshPageAdmin = (tokenSession) => {
  if (tokenSession !== null) {
    const editEl = document.querySelector(".edit");
    editEl.style.display = "block";
    const loginEl = document.getElementById("login");
    loginEl.innerHTML = "logout";
    loginEl.addEventListener("click", () => {
      sessionStorage.removeItem("Token");
      window.location.href = "index.html"; // Redirection vers la page d'accueil après la déconnexion
    });
  }
};

refreshPageAdmin(tokenSession);




