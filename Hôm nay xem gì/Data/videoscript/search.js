// Fetch actors and populate select
document.addEventListener("DOMContentLoaded", function () {
  const actorSelect = document.getElementById("actor");
  const typeSelect = document.getElementById("type");

  fetchList("http://localhost:3000/films/filters");
  // Fetch actors from API
  fetch("http://localhost:3000/actors")
    .then((response) => response.json())
    .then((data) => {
      actorSelect.innerHTML = '<option value="">Select Actor</option>';
      data.forEach((actor) => {
        const option = document.createElement("option");
        option.value = actor._id; // Assuming 'id' is actor's identifier
        option.textContent = actor.name; // Assuming 'name' is actor's name
        actorSelect.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Error fetching actors:", error);
      actorSelect.innerHTML = '<option value="">Failed to load actors</option>';
    });

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
      console.error("Error fetching types:", error);
      typeSelect.innerHTML = '<option value="">Failed to load types</option>';
    });

  const filterForm = document.getElementById("filterForm");
  // Handle form submission (filter on click)
  filterForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission behavior

    // Get selected filter values
    const year = document.getElementById("year").value;
    const actor = document.getElementById("actor").value;
    const type = document.getElementById("type").value;

    // Construct query parameters for the filter
    const queryParams = new URLSearchParams();
    if (year) queryParams.append("year", year);
    if (actor) queryParams.append("actor", actor);
    if (type) queryParams.append("type", type);

    // // Redirect or send the query via fetch (GET request)
    const queryUrl = `http://localhost:3000/films/filters?${queryParams.toString()}`;
    // window.location.href = queryUrl; // Redirect to the filter URL with query params

    // Alternatively, if you want to stay on the same page and handle the results in JavaScript:
    fetchList(queryUrl);
  });

  function fetchList(queryUrl) {
    fetch(queryUrl)
      .then((response) => response.json())
      .then((data) => {
        let html = "";
        data.forEach((film) => {
          html += `<a href="./filmInfo.html?id=${
            film._id
          }" class="shadow-lg  border rounded-lg  overflow-hidden">
            <img 
            class="h-[400px] w-[100%]"
            src="http://localhost:3000/uploads/${film?.image}"
            height="450px"
            alt="Cám">
            <div class="p-4">
                <h2 class="text-2xl font-bold text-gray-800">${
                  film.name
                } <span class="text-gray-500">(${film.year})</span></h2>
                <div class="mt-3 flex items-center">
                <span class="text-yellow-400 font-bold text-xl">${
                  film?.ratePeopleCount > 0
                    ? (film.rateCount / film?.ratePeopleCount).toFixed(2)
                    : 0
                }</span>
                <span class="ml-2 text-sm text-gray-600">(${
                  film?.ratePeopleCount
                } votes)</span>
                </div>
            </div>
            </a>
            `;
        });
        document.getElementById("filmList").innerHTML = html;
      })
      .catch((error) =>
        console.error("Error fetching filtered results:", error)
      );
  }
});
