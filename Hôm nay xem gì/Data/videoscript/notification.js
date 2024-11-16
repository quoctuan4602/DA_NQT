document.addEventListener("DOMContentLoaded", function () {
  const notificationDropdown = document.getElementById("notification");
  const notificationCount = document.getElementById("notification-count");

  const user = JSON.parse(localStorage.getItem("userInf"));
  // Function to fetch notifications from the API
  async function fetchNotifications() {
    try {
      // Replace with your API endpoint
      const response = await fetch(
        "http://localhost:3000/notification/get-rep-of/" + user._id
      );
      const { notifications } = await response.json();

      // Update notification count
      const unreadCount = notifications.filter(
        (notification) => notification.status === "unread"
      ).length;
      notificationCount.textContent = unreadCount;

      // Clear existing notifications
      notificationDropdown.innerHTML = "";

      // Loop through notifications and create list items
      notifications.forEach((notification) => {
        const a = document.createElement("a");
        a.classList.add("dropdown-item");
        a.textContent = notification.message;
        a.href = "./filmInfo.html?id=" + notification.filmId;

        // Add a class for unread notifications
        if (notification.status === "unread") {
          a.style.fontWeight = "bold";
        }

        // Append the notification to the dropdown
        notificationDropdown.appendChild(a);
      });
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }

  // Fetch notifications on page load
  fetchNotifications();
});
