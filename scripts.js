const apiUrl = "http://localhost:5678/api/works";
const galleryEl = document.querySelector(".gallery");

async function fetchData() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    renderData(data);
  } catch (error) {
    console.error(`Fetch error: ${error.message}`);
  }
}

function createFigure(item) {
  const newFigure = document.createElement("figure");
  const newImg = document.createElement("img");
  newImg.src = item.imageUrl;
  const newFigCaption = document.createElement("figcaption");
  newFigCaption.textContent = item.title;
  newFigure.appendChild(newImg);
  newFigure.appendChild(newFigCaption);
  return newFigure;
}

function renderData(data) {
  data.forEach(item => {
    const newFigure = createFigure(item);
    galleryEl.appendChild(newFigure);
  });
}

fetchData();
