document.addEventListener("DOMContentLoaded", function () {
  const user = JSON.parse(localStorage.getItem("userInf"));
  const { fullName, role, avatar, email, _id } = user;
  const fullNameInput = document.getElementById("fullName");
  const emailInput = document.getElementById("email");
  const roleInput = document.getElementById("role");
  const avatarInput = document.getElementById("avatar");

  const avatarImage = document.getElementById("avatar_image");
  const admin_role = document.getElementById("admin_role");
  fullNameInput.value = fullName;
  emailInput.value = email ? email : "";
  if (role != "admin") {
    roleInput.value = "Quản trị viên";
    admin_role.style.display = "none";
  }
  avatarImage.src = "http://localhost:3000/uploads/" + avatar;

  avatarInput.addEventListener("change", function (e) {
    const file = e.target.files[0]; // Get the first file from the FileList
    if (file) {
      const reader = new FileReader();

      reader.onload = function (event) {
        avatarImage.src = event.target.result; // Use the base64 string as the image source
      };

      reader.readAsDataURL(file); // Read the file as a base64 string
    }
  });

  const form = document.getElementById("userForm");
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("fullName", fullNameInput.value);
    formData.append("email", emailInput.value);
    formData.append("role", roleInput.value);
    formData.append("avatar", avatarInput.files[0]);

    fetch("http://localhost:3000/users/update/" + _id, {
      method: "PUT",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        const newUer = {
          ...data,
        };
        console.log(newUer);

        localStorage.setItem("userInf", JSON.stringify(newUer));
        Toastify({
          text: "Cập nhật thành công.",
          className: "info",
          style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
          },
        }).showToast();
      })
      .catch((error) => {
        console.error("Error:", error); // Handle errors
      });
  });
});
