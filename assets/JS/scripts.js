// Déclaration des constantes et variables pour les éléments DOM et les données
const apiUrl = "http://localhost:5678/api/works";
const galleryEl = document.querySelector(".gallery");
const modalContainer = document.querySelector(".modal-container");
const modalTriggers = document.querySelectorAll(".modal-trigger");
const overlay = document.querySelector(".overlay");
const openModal = document.getElementById("open-modal");
const allEl = document.getElementById("all");
const objEl = document.getElementById("obj");
const appartEl = document.getElementById("appart");
const hotRestauEl = document.getElementById("hot-restau");
const addPictureBtnModal1 = document.querySelector(".addpic-btn-modal1");
const modal2 = document.querySelector(".modal2");
const previousModalIcon = document.querySelector(".previous-modal");
const photoInput = document.getElementById("photo");
const labelImg = document.querySelector('.label-img');
const titleInput = document.querySelector(".form-title input");
const optionsSelect = document.querySelector(".form-options select");
const btnModal2 = document.getElementById("button-form");
let data = [];
const tokenSession = sessionStorage.getItem("Token");

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

// Fonction pour afficher les données dans la galerie principale
function renderData(data) {
  galleryEl.innerHTML = "";
  data.forEach(item => {
    // Création des éléments pour chaque élément de données
    const newFigure = document.createElement("figure");
    const newImg = document.createElement("img");
    newImg.src = item.imageUrl;
    const newFigCaption = document.createElement("figcaption");
    newFigCaption.textContent = item.title;

    // Construction de la structure de la galerie principale
    newFigure.appendChild(newImg);
    newFigure.appendChild(newFigCaption);
    galleryEl.appendChild(newFigure);
  });
}

// Filtrer les données par catégorie
function filterData(category) {
  const filteredData = data.filter(item => item.category.name === category);
  renderData(filteredData);
}

// Créer la galerie dans la modale
function createGallery(data) {
  const modalGallery = document.querySelector(".modal-gallery");
  modalGallery.innerHTML = "";

  data.forEach((item) => {
    // Création des éléments pour la galerie modale
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
      // Action à effectuer lors du clic sur l'icône de suppression
      console.log("J'ai cliqué");
      // Ajouter ici le code pour supprimer l'élément associé à l'icône trash.
    });
  });
}

// Fonction pour masquer la modale
function toggleModal() {
  modalContainer.style.display = "none";
  overlay.style.display = "none";
  modal2.style.display = "none";
  resetModal2();
}

// Ajout des écouteurs d'événements pour ouvrir et fermer la modale
modalTriggers.forEach(trigger => trigger.addEventListener("click", toggleModal));
openModal.addEventListener("click", () => {
  modalContainer.style.display = "block";
  overlay.style.display = "block";
});

// Écouteurs d'événements pour les filtres de la galerie principale
allEl.addEventListener('click', () => renderData(data));
objEl.addEventListener('click', () => filterData("Objets"));
appartEl.addEventListener('click', () => filterData("Appartements"));
hotRestauEl.addEventListener('click', () => filterData("Hotels & restaurants"));

// Fonction pour rafraîchir la page admin
function refreshPageAdmin(token) {
  if (token !== null) {
    const editEl = document.querySelector(".edit");
    editEl.style.display = "block";
    const loginEl = document.querySelector(".bold");
    loginEl.innerHTML = "logout";
    loginEl.addEventListener("click", () => {
      sessionStorage.removeItem("Token");
      window.location.href = "index.html";
    });
  }
}

// Initialisation de la page admin et gestion de la session utilisateur
refreshPageAdmin(tokenSession);

// Ajout des écouteurs d'événements pour la deuxième modale
addPictureBtnModal1.addEventListener("click", () => {
  modal2.style.display = "block";
});

previousModalIcon.addEventListener("click", () => {
  modalContainer.style.display = "block";
  modal2.style.display ="none";
  resetModal2();
});

// Écouteur d'événement pour le changement de la photo sélectionnée
photoInput.addEventListener('change', function() {
  const selectedFile = photoInput.files[0];
  const fileRegex = /\.(jpe?g|png)$/i;

  if (selectedFile && fileRegex.test(selectedFile.name)) {
    const reader = new FileReader();

    reader.onload = function(e) {
      const imageElement = document.createElement('img');
      imageElement.src = e.target.result;
      imageElement.alt = 'Selected Image';

      labelImg.innerHTML = '';
      labelImg.appendChild(imageElement);
    };

    reader.readAsDataURL(selectedFile);
  }
});

// Réinitialisation de la deuxième modale
document.addEventListener('DOMContentLoaded', function() {
  labelImg.defaultContent = labelImg.innerHTML;
});

// Fonction pour réinitialiser la deuxième modale
function resetModal2() {
  const defaultContent = labelImg.defaultContent;
  const imageInsideLabelImg = document.querySelector('.label-img img');
  if (imageInsideLabelImg) {
    imageInsideLabelImg.remove();
  }

  labelImg.innerHTML = defaultContent;
  titleInput.value = "";
  optionsSelect.value = "";
  changeBtnColor();
}

// Fonction pour changer la couleur du bouton en fonction des champs remplis
function changeBtnColor() {
  if (titleInput.value !== "" && optionsSelect.value !== "" && photoInput.files.length > 0) {
    btnModal2.style.background = "#1D6154";
  } else {
    btnModal2.style.background = "#A7A7A7";
  }
}

// Ajout d'écouteurs d'événements pour les changements dans les champs du formulaire
titleInput.addEventListener('input', changeBtnColor);
optionsSelect.addEventListener('change', changeBtnColor);
photoInput.addEventListener('change', changeBtnColor);

// Événement de chargement de la page pour initialiser le contenu
document.addEventListener("DOMContentLoaded", () => {
  fetchData();
});
