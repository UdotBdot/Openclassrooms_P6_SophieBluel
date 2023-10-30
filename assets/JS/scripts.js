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
const overlay = document.querySelector(".overlay")

modalTriggers.forEach(trigger => trigger.addEventListener("click", toggleModal));

function toggleModal() {
  modalContainer.style.display = "none"; // Fermer la modale
  overlay.style.display = "none";
  modal2.style.display = "none";
  resetModal2()
}

openModal.addEventListener("click", function () {
  modalContainer.style.display = "block"; // Ouvrir la modale
  overlay.style.display = "block"
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
      window.location.href = "/index.html"; // Redirection vers la page des projets après la deconnexion
    });
  }
};

refreshPageAdmin(tokenSession);

// Ouverture de la modale 2 
const addPictureBtnModal1 = document.querySelector(".addpic-btn-modal1");
const modal2 = document.querySelector(".modal2")

addPictureBtnModal1.addEventListener("click", function(){
  modal2.style.display = "block";
})

// Revenir à la modale 1 à partir de la modale 2 

const previousModalIcon = document.querySelector(".previous-modal");

previousModalIcon.addEventListener("click", function(){
  modalContainer.style.display = "block";
  modal2.style.display ="none";
  resetModal2()
})

// Fonctionnalités de la 2eme modale

// Écouteur d'événement pour le changement de la photo sélectionnée
const photoInput = document.getElementById("photo");
const labelImg = document.querySelector('.label-img'); // Sélection de l'élément avec la classe label-img

photoInput.addEventListener('change', function() {
    const selectedFile = photoInput.files[0]; // Récupération du fichier sélectionné
    const fileRegex = /\.(jpe?g|png)$/i; // Expression régulière pour vérifier l'extension

    // Vérification du fichier sélectionné
    if (selectedFile && fileRegex.test(selectedFile.name)) {
        const reader = new FileReader();

        reader.onload = function(e) {
            // Création d'une balise img pour afficher l'image sélectionnée
            const imageElement = document.createElement('img');
            imageElement.src = e.target.result;
            imageElement.alt = 'Selected Image';

            // Effacer le contenu existant de label-img et insérer l'image
            labelImg.innerHTML = '';
            labelImg.appendChild(imageElement);
        };

        // Lecture du contenu du fichier sélectionné
        reader.readAsDataURL(selectedFile);
    }
});

// Fonction pour réinitialiser la deuxième modale
// Sauvegarde du contenu par défaut au chargement initial
document.addEventListener('DOMContentLoaded', function() {
  const labelImg = document.querySelector('.label-img');
  labelImg.defaultContent = labelImg.innerHTML;
});

// Fonction pour réinitialiser la deuxième modal
function resetModal2() {
  const labelImg = document.querySelector('.label-img');
  const defaultContent = labelImg.defaultContent;

  // Supprimer l'image actuelle, si présente
  const imageInsideLabelImg = document.querySelector('.label-img img');
  if (imageInsideLabelImg) {
    imageInsideLabelImg.remove();
}

  // Réinsérer le contenu par défaut
  labelImg.innerHTML = defaultContent;
  titleInput.value = "";
  optionsSelect.value = "";
}

// Changer la couleur du bouton 
const titleInput = document.querySelector(".form-title input");
const optionsSelect = document.querySelector(".form-options select");
const imgWorks = document.getElementById("photo");
const btnModal2 = document.getElementById("button-form")

// Fonction pour vérifier et changer la couleur du bouton
function changeBtnColor() {
  if (titleInput.value !== "" && optionsSelect.value !== "" && imgWorks.files.length > 0) {
    btnModal2.style.background = "#1D6154";
  } else {
    btnModal2.style.background = "#A7A7A7"; // Réinitialise la couleur du bouton
  }
}
// Ajout d'écouteurs d'événements pour les changements dans les champs du formulaire
titleInput.addEventListener('input', changeBtnColor);
optionsSelect.addEventListener('change', changeBtnColor);
imgWorks.addEventListener('change', changeBtnColor);

// Ajout des photos dans la page d'accueil 
