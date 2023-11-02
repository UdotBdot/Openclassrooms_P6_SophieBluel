////////////////////////////////////////////////////////////
// Gestion des modules principaux /////////////////////////
//////////////////////////////////////////////////////////
// SECTION : 1- RÉCUPÉRATION ET AFFICHAGE DE DONNÉES   //
//           2- FILTRAGE DES DONNÉES                  //
//           3- CRÉATION ET SUPPRESSION D'ÉLÉMENTS   //
//           4- AJOUT D'UN PROJET                   //
//           5- GESTION DES MODALES                //
////////////////////////////////////////////////////

// Définition des éléments HTML et des variables nécessaires à l'application
const apiUrl = "http://localhost:5678/api/works"; // URL de l'API pour les travaux
const galleryEl = document.querySelector(".gallery"); // Élément contenant la galerie d'images
const galleryModal = document.querySelector(".modal-gallery"); // Élément modal pour la galerie
const editHeaderBtn = document.querySelector(".edit-header-btn"); // Bouton d'édition dans l'en-tête
const modalContainer = document.querySelector(".modal-container"); // Conteneur principal du modal
const modalTriggers = document.querySelectorAll(".modal-trigger"); // Déclencheurs du modal
const overlay = document.querySelector(".overlay"); // Superposition pour le modal
const openModal = document.getElementById("open-modal"); // Bouton pour ouvrir le modal
const allEl = document.getElementById("all"); // Élément pour afficher tous les travaux
const objEl = document.getElementById("obj"); // Élément pour afficher les travaux de type "Objets"
const appartEl = document.getElementById("appart"); // Élément pour afficher les travaux de type "Appartements"
const hotRestauEl = document.getElementById("hot-restau"); // Élément pour afficher les travaux de type "Hotels & restaurants"
const addPictureBtnModal1 = document.querySelector(".addpic-btn-modal1"); // Bouton pour ajouter une image dans le modal 1
const modal2 = document.querySelector(".modal2"); // Deuxième modal
const previousModalIcon = document.querySelector(".previous-modal"); // Icône pour revenir dans le modal précédent
const photoInput = document.getElementById("photo"); // Champ pour télécharger une photo
const labelImg = document.querySelector('.label-img'); // Élément pour afficher l'image sélectionnée
const titleInput = document.querySelector(".form-title input"); // Champ de saisie pour le titre
const optionsSelect = document.querySelector(".form-options select"); // Sélecteur pour les options
const btnModal2 = document.getElementById("button-form"); // Bouton du formulaire modal 2
let data = []; // Données des travaux
const tokenSession = sessionStorage.getItem("Token"); // Récupération du jeton d'authentification depuis la session

//////////////////////////////////////////////////////////////////////
// SECTION : 1- RÉCUPÉRATION ET AFFICHAGE DE DONNÉES ////////////////
////////////////////////////////////////////////////////////////////

// Fonction asynchrone pour récupérer les données depuis l'API
async function fetchData() {
  try {
    // Appel de l'API pour récupérer les données des travaux
    const response = await fetch(apiUrl);
    // Extraction des données JSON de la réponse
    data = await response.json();
    // Affichage des données dans la galerie principale
    renderData(data);
    // Création de la galerie modale avec les données récupérées
    createGallery(data);
  } catch (error) {
    // En cas d'erreur, affiche un message dans la console
    console.error("Erreur lors de la récupération des données : ", error);
  }
}

// Fonction pour afficher les données dans la galerie
function renderData(data) {
  // Efface le contenu actuel de la galerie
  galleryEl.innerHTML = "";
  // Pour chaque élément de données, crée un élément "figure" avec une image et une légende, puis l'ajoute à la galerie
  data.forEach(item => {
    const newFigure = document.createElement("figure");
    const newImg = document.createElement("img");
    newImg.src = item.imageUrl; // Attribue l'URL de l'image à la source de l'élément img
    const newFigCaption = document.createElement("figcaption");
    newFigCaption.textContent = item.title; // Définit le texte de la légende
    newFigure.appendChild(newImg); // Ajoute l'image à l'élément figure
    newFigure.appendChild(newFigCaption); // Ajoute la légende à l'élément figure
    galleryEl.appendChild(newFigure); // Ajoute l'élément figure à la galerie
  });
}

//////////////////////////////////////////////////////
// SECTION : 2- FILTRAGE DES DONNÉES ////////////////
////////////////////////////////////////////////////

// Fonction pour filtrer les données en fonction de la catégorie
function filterData(category) {
  // Filtrer les données selon la catégorie spécifiée
  const filteredData = data.filter(item => item.category.name === category);
  // Afficher les données filtrées dans la galerie
  renderData(filteredData);
}

// Fonction pour créer la galerie modale avec les données spécifiées
function createGallery(data) {
  const modalGallery = document.querySelector(".modal-gallery");
  modalGallery.innerHTML = "";

  // Pour chaque élément de données, crée un élément "figure" avec une image et une icône de suppression
  data.forEach((item) => {
    const figure = document.createElement("figure");
    figure.innerHTML = `
      <div class="trash" id="${item.id}">
        <i class="fa-solid fa-trash-can"></i>
      </div>
      <img src="${item.imageUrl}" alt="">
    `;
    modalGallery.appendChild(figure); // Ajoute l'élément figure à la galerie modale

    ///////////////////////////////////////////////////////////////////
    // SECTION : 3- CRÉATION ET SUPPRESSION D'ÉLÉMENTS ////////////////
    //////////////////////////////////////////////////////////////////
    
    const trashIcon = figure.querySelector(".trash"); // Sélection de l'icône de suppression
    trashIcon.addEventListener("click", async () => {
      deleteItem(item.id); // Gestion de la suppression au clic sur l'icône
    });
  });

  // Fonction asynchrone pour supprimer un élément
  async function deleteItem(id) {
    try {
      // Appel à l'API pour supprimer l'élément spécifié par son ID
      const response = await fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": "Bearer " + tokenSession,
        },
      });
      const modalError = document.querySelector(".modal1-pError");
      const modalValidate = document.querySelector(".modal1-pValidate");
      if (response.status === 200 || response.status === 204) {
        modalError.style.display = "none";
        modalValidate.style.display = "block";
        modalValidate.textContent = "La suppression est réussie.";
        console.log("Suppression réussie.");
        fetchData(); // Met à jour les données après la suppression
      } else {
        modalValidate.style.display = "none";
        modalError.style.display = "block";
        modalError.textContent = "La suppression a échoué.";
        console.error("Échec de la suppression.");
      }
      // Masque les messages après un délai de 1500 ms
      setTimeout(function() {
        modalError.style.display = "none";
        modalValidate.style.display = "none";
      }, 1500);
    } catch (error) {
      console.error("Une erreur s'est produite :", error);
    }
  }
}

//////////////////////////////////////////////////////
// SECTION : 4-// AJOUT D'UN PROJET /////////////////
////////////////////////////////////////////////////

// Fonction asynchrone pour ajouter une œuvre via un formulaire
const addWorks = async () => {
  // Création d'un objet FormData contenant les données du formulaire
  const formData = new FormData();
  formData.append("image", photoInput.files[0]);
  formData.append("title", titleInput.value);
  formData.append("category", optionsSelect.value);
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenSession}`,
      },
      body: formData,
    });
    if (response.ok) {
      const data = await response.json();
      // Crée un nouvel élément figure avec l'image et la légende reçues
      const newFigure = document.createElement("figure");
      const newImg = document.createElement("img");
      newImg.src = data.imageUrl;
      const newFigCaption = document.createElement("figcaption");
      newFigCaption.textContent = data.title;
      newFigure.appendChild(newImg); // Ajoute l'image à l'élément figure
      galleryModal.appendChild(newFigure); // Ajoute l'élément figure à la galerie modale
      newFigure.appendChild(newFigCaption); // Ajoute la légende à l'élément figure
      galleryEl.appendChild(newFigure); // Ajoute l'élément figure à la galerie principale
      modal2Error.style.display = "none"; // Masque le message d'erreur du modal 2
      modal2Validate.style.display = "block"; // Affiche le message de validation du modal 2
      modal2Validate.textContent = "La photo a été ajoutée"; // Définit le texte du message de validation
      // Réinitialise le modal, le champ d'image, cache le modal et met à jour les données après un délai
      setTimeout(() => {
        resetModal2();
        resetImageInput();
        toggleModal();
        fetchData();
        hideModalMessages();
      }, 2000);
    } else if (response.status === 401) {
      console.error("Non autorisé à ajouter un projet");
      sessionStorage.removeItem("Token");
      window.location.href = "login.html";
      hideModalMessages();
    } else {
      throw new Error(`Réponse HTTP inattendue : ${response.status}`);
      hideModalMessages();
    }
  } catch (error) {
    console.error("Une erreur s'est produite :", error);
    modal2Validate.style.display = "none"; // Masque le message de validation du modal 2
    modal2Error.style.display = "block"; // Affiche le message d'erreur du modal 2
    modal2Error.textContent = "Erreur : La photo n'a pas pu être ajoutée."; // Définit le texte du message d'erreur
    // Réinitialise le modal, le champ d'image, cache le modal, met à jour les données après un délai
    setTimeout(() => {
      resetModal2();
      resetImageInput();
      toggleModal();
      fetchData();
      hideModalMessages();
    }, 2000);
  }
};

// Attend que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', function() {
  // Sélectionne le formulaire modal
  const modalForm = document.getElementById('js-modal-form');
  // Ajoute un écouteur d'événement pour le formulaire modal lors de sa soumission
  modalForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Empêche l'envoi classique du formulaire
    // Récupère les données du formulaire
    const title = document.getElementById('titre').value;
    const category = document.getElementById('categorie').value;
    const photo = document.getElementById('photo').files[0];
    addWorks(title, category, photo); // Appelle la fonction pour ajouter une œuvre avec les données du formulaire
  });
});

//////////////////////////////////////////////////////
// SECTION : 5-// GESTION DES MODALS ////////////////
////////////////////////////////////////////////////

// Fonction pour réinitialiser le champ d'entrée de l'image
function resetImageInput() {
  photoInput.value = ''; // Efface la valeur du champ d'entrée de l'image
}

// Fonction pour basculer l'état du modal
function toggleModal() {
  // Masque le conteneur principal du modal, la superposition et le second modal
  modalContainer.style.display = "none";
  overlay.style.display = "none";
  modal2.style.display = "none";
  resetModal2(); // Réinitialise le modal 2
  resetImageInput(); // Réinitialise le champ d'entrée de l'image
}

// Ajoute un événement de clic pour chaque déclencheur de modal
modalTriggers.forEach(trigger => trigger.addEventListener("click", toggleModal));
// Écoute le clic sur l'élément "openModal" pour afficher le modal et la superposition
openModal.addEventListener("click", () => {
  modalContainer.style.display = "block";
  overlay.style.display = "block";
});

// Ajoute un événement de clic sur le bouton d'édition dans l'en-tête
editHeaderBtn.addEventListener("click", () => {
  // Affiche le conteneur principal du modal et la superposition
  modalContainer.style.display = "block";
  overlay.style.display = "block";
});

// Ajoute des écouteurs d'événements de clic pour les différents éléments
allEl.addEventListener('click', () => renderData(data)); // Affiche tous les travaux
objEl.addEventListener('click', () => filterData("Objets")); // Filtre les travaux de type "Objets"
appartEl.addEventListener('click', () => filterData("Appartements")); // Filtre les travaux de type "Appartements"
hotRestauEl.addEventListener('click', () => filterData("Hotels & restaurants")); // Filtre les travaux de type "Hotels & restaurants"

// Fonction pour rafraîchir la page de l'administrateur
function refreshPageAdmin(token) {
  if (token !== null) {
    // Affiche les éléments pour l'édition et l'en-tête d'administration
    const editEl = document.querySelector(".edit");
    editEl.style.display = "block";
    const adminHeader = document.querySelector(".admin-header");
    adminHeader.style.display = "block";
    // Modifie l'élément de connexion pour permettre la déconnexion
    const loginEl = document.querySelector(".bold");
    loginEl.innerHTML = "logout";
    loginEl.addEventListener("click", () => {
      // Supprime le jeton d'authentification de la session et redirige vers la page d'accueil
      sessionStorage.removeItem("Token");
      window.location.href = "index.html";
    });
  }
}

// Appelle la fonction de rafraîchissement de la page d'administration avec le jeton actuel
refreshPageAdmin(tokenSession);

// Ajoute un événement de clic pour afficher le modal 2 lorsqu'on clique sur le bouton d'ajout d'image dans le modal 1
addPictureBtnModal1.addEventListener("click", () => {
  modal2.style.display = "block";
});

// Ajoute un événement de clic pour revenir au modal précédent lorsqu'on clique sur l'icône précédente
previousModalIcon.addEventListener("click", () => {
  modalContainer.style.display = "block"; // Affiche le conteneur du modal principal
  modal2.style.display = "none"; // Cache le modal 2
  resetModal2(); // Réinitialise le modal 2
  resetImageInput(); // Réinitialise le champ d'entrée d'image
});

// Écoute les changements dans le champ d'entrée pour télécharger une image
photoInput.addEventListener('change', function() {
  const selectedFile = photoInput.files[0]; // Récupère le fichier sélectionné
  const fileRegex = /\.(jpe?g|png)$/i; // Expression régulière pour vérifier le format de fichier

  // Vérifie si un fichier est sélectionné et s'il correspond au format attendu (JPEG ou PNG)
  if (selectedFile && fileRegex.test(selectedFile.name)) {
    const reader = new FileReader(); // Initialise un lecteur de fichier

    reader.onload = function(e) {
      const imageElement = document.createElement('img'); // Crée un élément img
      imageElement.src = e.target.result; // Récupère l'URL de l'image chargée
      imageElement.alt = 'Selected Image'; // Définit le texte alternatif de l'image

      labelImg.innerHTML = ''; // Efface le contenu actuel de l'élément labelImg
      labelImg.appendChild(imageElement); // Ajoute l'image à l'élément labelImg
    };

    reader.readAsDataURL(selectedFile); // Lit le fichier comme une URL de données
  }
});

// Stocke le contenu par défaut de labelImg dans la propriété defaultContent
labelImg.defaultContent = labelImg.innerHTML;

// Fonction pour réinitialiser le modal 2
function resetModal2() {
  const defaultContent = labelImg.defaultContent; // Récupère le contenu par défaut de labelImg
  const imageInsideLabelImg = document.querySelector('.label-img img');
  // Supprime l'image à l'intérieur de labelImg s'il existe
  if (imageInsideLabelImg) {
    imageInsideLabelImg.remove();
  }
  labelImg.innerHTML = defaultContent; // Rétablit le contenu par défaut de labelImg
  titleInput.value = ""; // Réinitialise la valeur du champ de titre
  optionsSelect.value = ""; // Réinitialise la valeur du sélecteur d'options
  changeBtnColor(); // Appelle la fonction pour changer la couleur du bouton
}

// Fonction pour changer la couleur du bouton en fonction des champs remplis
function changeBtnColor() {
  // Vérifie si le champ de titre, le sélecteur d'options et le champ d'image sont remplis
  if (titleInput.value !== "" && optionsSelect.value !== "" && photoInput.files.length > 0) {
    btnModal2.style.background = "#1D6154"; // Change la couleur du bouton en vert
  } else {
    btnModal2.style.background = "#A7A7A7"; // Change la couleur du bouton en gris
  }
}

// Ajoute des écouteurs pour déclencher la fonction changeBtnColor lors des changements dans les champs
titleInput.addEventListener('input', changeBtnColor); // Lorsque du texte est saisi dans le champ de titre
optionsSelect.addEventListener('change', changeBtnColor); // Lorsque l'option sélectionnée change dans le sélecteur
photoInput.addEventListener('change', changeBtnColor); // Lorsque le fichier d'image est changé

// Appelle la fonction fetchData pour récupérer les données initiales et initialiser l'affichage
fetchData();

// Sélection des éléments d'erreur et de validation dans le modal 2
const modal2Error = document.querySelector(".modal2-pError");
const modal2Validate = document.querySelector(".modal2-pValidate");

// Masque les messages d'erreur et de validation par défaut
modal2Error.style.display = "none";
modal2Validate.style.display = "none";

// Fonction pour masquer les messages du modal après un délai spécifique
function hideModalMessages() {
  setTimeout(() => {
    modal2Error.style.display = "none";
    modal2Validate.style.display = "none";
  }, 2000);
}