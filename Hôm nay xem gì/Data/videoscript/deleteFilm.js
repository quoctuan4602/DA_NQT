const deleteBtn = document.getElementById("deleteBtn");

deleteBtn.addEventListener("click", () => {
  fetch(`http://localhost:3000/films/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to delete film");
      }
      Toastify({
        text: "Delete phim thành công.",
        className: "info",
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
      }).showToast();
      window.location.href = "filmList.html";
    })
    .catch((error) => {
      console.error("Error deleting film:", error);
    });
});
