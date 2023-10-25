const apiUrl = "http://localhost:5678/api/works";
const galleryEl = document.querySelector(".gallery");
let data = [];

async function fetchData() {
  const response = await fetch(apiUrl);
  data = await response.json();
  renderData(data);
  createGallery(data);
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

fetchData();

// Modal1 - Fermeture & Ouverture
const modalContainer = document.querySelector(".modal-container");
const modalTriggers = document.querySelectorAll(".modal-trigger");
const openModal = document.getElementById("open-modal");

modalTriggers.forEach(trigger => trigger.addEventListener("click", toggleModal))

function toggleModal() {
  modalContainer.style.display = "none";
}

openModal.addEventListener("click", function () {
  modalContainer.style.display = "block"
})

// Ajouter Dynamiquement les photos dans la modale 
const createGallery = (data) => {
  const modalGallery = document.querySelector(".modal-gallery");
  data.forEach((items) => {
    modalGallery.insertAdjacentHTML('beforeend', `
  <figure>
  <div class="trash" id="${items.id}">
    <i class="fa-solid fa-trash-can" id="${items.id}"></i>
  </div>
  <img src="${items.imageUrl}" alt="">
</figure>
  `)
  })
}

const tokenSession = sessionStorage.getItem("Token");
const refreshPageAdmin = (tokenSession) => {
  if(tokenSession !== null) {
    const editEl = document.querySelector(".edit")
    editEl.style.display = "block"
    const loginEl = document.getElementById("login")
    loginEl.innerHTML = "logout";
    loginEl.addEventListener("click", () => {
      sessionStorage.removeItem("Token");
      loginEl.href = "index.html";
    });
  }
  }
refreshPageAdmin(tokenSession);

