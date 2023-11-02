const apiUrl = "http://localhost:5678/api/works";
const galleryEl = document.querySelector(".gallery");
const galleryModal = document.querySelector(".modal-gallery")
const editHeaderBtn = document.querySelector(".edit-header-btn")
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

function filterData(category) {
  const filteredData = data.filter(item => item.category.name === category);
  renderData(filteredData);
}

function createGallery(data) {
  const modalGallery = document.querySelector(".modal-gallery");
  modalGallery.innerHTML = "";

  data.forEach((item) => {
    const figure = document.createElement("figure");
    figure.innerHTML = `
      <div class="trash" id="${item.id}">
        <i class="fa-solid fa-trash-can"></i>
      </div>
      <img src="${item.imageUrl}" alt="">
    `;
    modalGallery.appendChild(figure);
    const trashIcon = figure.querySelector(".trash");
    trashIcon.addEventListener("click", async () => {
      deleteItem(item.id);
    });
  });

async function deleteItem(id) {
  try {
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
      fetchData(); 
    } else {
      modalValidate.style.display = "none";
      modalError.style.display = "block";
      modalError.textContent = "La suppression a échoué.";
      console.error("Échec de la suppression.");
    }

     setTimeout(function() {
      modalError.style.display = "none";
      modalValidate.style.display = "none";
    }, 1500); 
  } catch (error) {
    console.error("Une erreur s'est produite :", error);
  }
}
}

function resetImageInput() {
  photoInput.value = ''; 
}

function toggleModal() {
  modalContainer.style.display = "none";
  overlay.style.display = "none";
  modal2.style.display = "none";
  resetModal2();
  resetImageInput();
}

modalTriggers.forEach(trigger => trigger.addEventListener("click", toggleModal));
openModal.addEventListener("click", () => {
  modalContainer.style.display = "block";
  overlay.style.display = "block";
}
);
editHeaderBtn.addEventListener("click", () => {
  modalContainer.style.display = "block";
  overlay.style.display = "block";
})

allEl.addEventListener('click', () => renderData(data));
objEl.addEventListener('click', () => filterData("Objets"));
appartEl.addEventListener('click', () => filterData("Appartements"));
hotRestauEl.addEventListener('click', () => filterData("Hotels & restaurants"));

function refreshPageAdmin(token) {
  if (token !== null) {
    const editEl = document.querySelector(".edit");
    editEl.style.display = "block";
    const adminHeader = document.querySelector(".admin-header");
  adminHeader.style.display = "block";
    const loginEl = document.querySelector(".bold");
    loginEl.innerHTML = "logout";
    loginEl.addEventListener("click", () => {
      sessionStorage.removeItem("Token");
      window.location.href = "index.html";
    });
  }
}

refreshPageAdmin(tokenSession);

addPictureBtnModal1.addEventListener("click", () => {
  modal2.style.display = "block";
});

previousModalIcon.addEventListener("click", () => {
  modalContainer.style.display = "block";
  modal2.style.display ="none";
  resetModal2();
  resetImageInput()
});

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

labelImg.defaultContent = labelImg.innerHTML;

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

function changeBtnColor() {
  if (titleInput.value !== "" && optionsSelect.value !== "" && photoInput.files.length > 0) {
    btnModal2.style.background = "#1D6154";
  } else {
    btnModal2.style.background = "#A7A7A7";
  }
}

titleInput.addEventListener('input', changeBtnColor);
optionsSelect.addEventListener('change', changeBtnColor);
photoInput.addEventListener('change', changeBtnColor);

fetchData();

const modal2Error = document.querySelector(".modal2-pError")
const modal2Validate = document.querySelector(".modal2-pValidate")

modal2Error.style.display = "none";
modal2Validate.style.display = "none";

// Fonction pour effacer les messages après un délai
function hideModalMessages() {
  setTimeout(() => {
    modal2Error.style.display = "none";
    modal2Validate.style.display = "none";
  }, 2000); // 2000 ms = 2 secondes
}


const addWorks = async () => {
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

      const newFigure = document.createElement("figure");
      const newImg = document.createElement("img");
      newImg.src = data.imageUrl;
      const newFigCaption = document.createElement("figcaption");
      newFigCaption.textContent = data.title;

      newFigure.appendChild(newImg);
      galleryModal.appendChild(newFigure);
      newFigure.appendChild(newFigCaption);
      galleryEl.appendChild(newFigure);

      modal2Error.style.display = "none";
      modal2Validate.style.display = "block";
      modal2Validate.textContent = "La photo a été ajoutée";

      // Attente de 2 secondes avant de réinitialiser et fermer la modale
      setTimeout(() => {
        resetModal2();
        resetImageInput();
        toggleModal();
        fetchData();
        hideModalMessages()
      }, 2000); // 2000 ms = 2 secondes
    } else if (response.status === 401) {
      console.error("Non autorisé à ajouter un projet");
      sessionStorage.removeItem("Token");
      window.location.href = "login.html";
      hideModalMessages() 
    } else {
      throw new Error(`Réponse HTTP inattendue : ${response.status}`);
      hideModalMessages()
    }
  } catch (error) {
    console.error("Une erreur s'est produite :", error);

    modal2Validate.style.display = "none";
    modal2Error.style.display = "block";
    modal2Error.textContent = "Erreur : La photo n'a pas pu être ajoutée.";

    // Attente de 2 secondes avant de réinitialiser et fermer la modale
    setTimeout(() => {
      resetModal2();
      resetImageInput();
      toggleModal();
      fetchData();
      hideModalMessages()
    }, 2000); // 2000 ms = 2 secondes
  }
};


document.addEventListener('DOMContentLoaded', function() {
  const modalForm = document.getElementById('js-modal-form');

  modalForm.addEventListener('submit', function(event) {
      event.preventDefault(); 

      const title = document.getElementById('titre').value;
      const category = document.getElementById('categorie').value;
      const photo = document.getElementById('photo').files[0]; 

      addWorks(title, category, photo);
  });
});





