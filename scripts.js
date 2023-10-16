const apiUrl = "http://localhost:5678/api/works";
const galleryEl = document.querySelector(".gallery");
let data = [];

async function fetchData() {
  const response = await fetch(apiUrl);
  data = await response.json(); 
  renderData(data);
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

const allEl = document.getElementById("All");
const objEl = document.getElementById("Obj");
const appartEl = document.getElementById("Appart");
const hotRestauEl = document.getElementById("HotRestau");

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

