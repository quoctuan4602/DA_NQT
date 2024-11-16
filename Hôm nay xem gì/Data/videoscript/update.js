const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

// Fetch film data based on the ID
fetch(`http://localhost:3000/films/filmId/${id}`)
  .then((response) => response.json())
  .then((film) => {
    // Populate the form with the fetched film data
    document.getElementById("name").value = film.name || "";
    document.getElementById("description").value = film.description || "";
    document.getElementById("type").value = film.type || "";
    document.getElementById("actor").value = film.actor || "";
    document.getElementById("director").value = film.director || "";
    document.getElementById("year").value = film.year || "";
  })
  .catch((error) => {
    console.error("Error fetching film data:", error);
  });

document
  .getElementById("update-film-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const type = document.getElementById("type").value;
    const actor = document.getElementById("actor").value;
    const director = document.getElementById("director").value;
    const year = document.getElementById("year").value;
    const description = document.getElementById("description").value;
    const imageFile = document.getElementById("image").files[0];
    const videoFile = document.getElementById("video").files[0];
    const formData = new FormData();

    formData.append("name", name);
    formData.append("type", type);
    formData.append("actor", actor);
    formData.append("director", director);
    formData.append("year", year);
    formData.append("description", description);
    if (imageFile) formData.append("image", imageFile);
    if (videoFile) formData.append("video", videoFile);

    fetch(`http://localhost:3000/films/update/${id}`, {
      method: "PUT",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        Toastify({
          text: "Cập nhật thành công.",
          className: "info",
          style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
          },
        }).showToast();
      })
      .catch((error) => {
        console.error("Error updating film:", error);
        Toastify({
          text: "Cập nhật thất bại.",
          className: "info",
          style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
          },
        }).showToast();
      });
  });

document.addEventListener("DOMContentLoaded", function () {
  const typeSelect = document.getElementById("type");
  fetch("http://localhost:3000/types")
    .then((response) => response.json())
    .then((data) => {
      typeSelect.innerHTML = '<option value="">Select Type</option>';
      data.forEach((type) => {
        const option = document.createElement("option");
        option.value = type._id; // Assuming 'id' is type's identifier
        option.textContent = type.name; // Assuming 'name' is type's name
        typeSelect.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Error fetching types:", error);
      typeSelect.innerHTML = '<option value="">Failed to load types</option>';
    });
});
