// Handle form submission
document
  .getElementById("filmForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    // Collect form data
    const name = document.getElementById("name").value;
    const type = document.getElementById("type").value;
    const actor = document.getElementById("actor").value;
    const director = document.getElementById("director").value;
    const year = document.getElementById("year").value;
    const description = document.getElementById("description").value;
    const imageFile = document.getElementById("image").files[0];
    const videoFile = document.getElementById("video").files[0];

    // Prepare form data as JSON
    const formData = new FormData();

    formData.append("name", name);
    formData.append("type", type);
    formData.append("actor", actor);
    formData.append("director", director);
    formData.append("year", year);
    formData.append("description", description);
    formData.append("image", imageFile);
    formData.append("video", videoFile);

    // Send the form data to the API
    fetch("http://localhost:3000/films", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        Toastify({
          text: "Tạo phim thành công.",
          className: "info",
          style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
          },
        }).showToast();
        this.reset();
      })
      .catch((error) => console.error("Error uploading film:", error));
  });
// Fetch actors and populate select
document.addEventListener("DOMContentLoaded", function () {
  // const actorSelect = document.getElementById("actor");
  const typeSelect = document.getElementById("type");

  // Fetch actors from API
  // fetch("http://localhost:3000/actors")
  //   .then((response) => response.json())
  //   .then((data) => {
  //     actorSelect.innerHTML = '<option value="">Select Actor</option>';
  //     data.forEach((actor) => {
  //       const option = document.createElement("option");
  //       option.value = actor._id; // Assuming 'id' is actor's identifier
  //       option.textContent = actor.name; // Assuming 'name' is actor's name
  //       actorSelect.appendChild(option);
  //     });
  //   })
  //   .catch((error) => {
  //     console.error("Error fetching actors:", error);
  //     actorSelect.innerHTML = '<option value="">Failed to load actors</option>';
  //   });

  // Fetch types from API
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
      typeSelect.innerHTML = '<option value="">Failed to load types</option>';
    });
});
