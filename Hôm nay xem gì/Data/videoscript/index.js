document.addEventListener("DOMContentLoaded", () => {
  fetchNewFilm();
  fetchHotFilm();
});

function fetchNewFilm() {
  fetch("http://localhost:3000/films/sort/new")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      let slideItemRender = "";
      for (let i = 0; i < data.length; i += 3) {
        slideItemRender += `
          <div class="carousel-item ${i === 0 ? "active" : ""}">
            <div class="row">
        `;

        for (let j = i; j < i + 3 && j < data.length; j++) {
          const item = data[j];
          slideItemRender += `
            <a href="./filmInfo.html?id=${item._id}" class="col-md-4 p-0">
              <div >
                <img
                  src="http://localhost:3000/uploads/${item?.image}"
                  class="card-img-top"
                  style="height:800px"
                />
                <p class="content">
                  ${item?.description}
                </p>
              </div>
            </a>
          `;
        }

        slideItemRender += `
            </div>
          </div>
        `;
      }

      document.querySelector("#carousel-inner").innerHTML = slideItemRender;
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}

function fetchHotFilm() {
  fetch("http://localhost:3000/films/sort/by-rate")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      let slideItemRender = "";
      data.forEach((item, index) => {
        if (index < 5) {
          slideItemRender += ` <a href="./filmInfo.html?id=${item._id}"  style="width:19%">
            <div>
              <img
                src="http://localhost:3000/uploads/${item?.image}"
                class="card-img-top"
                style="height:500px"
              />
              <p class="content">${item?.description}</p>
            </div>
          </a>`;
        }
      });

      document.querySelector("#filmHot").innerHTML = slideItemRender;
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}
