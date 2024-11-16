const video1 = document.getElementById("my-video1");
const video2 = document.getElementById("my-video2");
const video3 = document.getElementById("my-video3");
const video4 = document.getElementById("my-video4");
const video5 = document.getElementById("my-video5");
const video6 = document.getElementById("my-video6");
const video7 = document.getElementById("my-video7");
const video8 = document.getElementById("my-video8");
function playVideoWhenVisible(video) {
  const videoRect = video.getBoundingClientRect();
  const isVisible =
    videoRect.top >= 0 &&
    videoRect.left >= 0 &&
    videoRect.bottom <= window.innerHeight &&
    videoRect.right <= window.innerWidth;
  if (isVisible) {
    video.play();
  } else {
    video.pause();
  }
}
window.addEventListener("scroll", function () {
  playVideoWhenVisible(video1);
  playVideoWhenVisible(video2);
  playVideoWhenVisible(video3);
  playVideoWhenVisible(video4);
  playVideoWhenVisible(video5);
  playVideoWhenVisible(video6);
  playVideoWhenVisible(video7);
  playVideoWhenVisible(video8);
});
window.addEventListener("resize", function () {
  playVideoWhenVisible(video1);
  playVideoWhenVisible(video2);
  playVideoWhenVisible(video3);
  playVideoWhenVisible(video4);
  playVideoWhenVisible(video5);
  playVideoWhenVisible(video6);
  playVideoWhenVisible(video7);
  playVideoWhenVisible(video8);
});

function reveal() {
  var reveals = document.querySelectorAll(".reveal");

  for (var i = 0; i < reveals.length; i++) {
    var windowHeight = window.innerHeight;
    var elementTop = reveals[i].getBoundingClientRect().top;
    var elementVisible = 50;

    if (elementTop < windowHeight - elementVisible) {
      reveals[i].classList.add("active");
    } else {
      reveals[i].classList.remove("active");
    }
  }
}
window.addEventListener("scroll", reveal);

function openSideNav() {
  document.getElementById("overlay-nav").style.width = "250px";
}

function closeSideNav() {
  document.getElementById("overlay-nav").style.width = "0px";
}

document.addEventListener("DOMContentLoaded", function () {
  const user = JSON.parse(localStorage.getItem("userInf"));
  if (!user) {
    document.getElementById(
      "usermenu"
    ).innerHTML = `<a class="text-white btn btn-primary me-5" href="./login.html">
          Đăng nhập
        </a>`;
  } else {
    document.getElementById("usermenu").innerHTML = `
        <div class="dropdown">
        <button class=" me-5 bg-transparent border-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
          <image src="./Data/logo/avatar.png" style="width:40px">
          </image>
          </button>
      <ul class="dropdown-menu">
        ${
          user.role === "admin"
            ? `<li>
            <a class="dropdown-item" href="./createMovie.html">
              Tạo Phim
            </a>
          </li>`
            : ""
        }
        <li><a class="dropdown-item" href="./updateUser.html">Cập nhật thông tin người dùng</a></li>
        <li><a class="dropdown-item" href="./logout.html">Logout</a></li>
      </ul>
    </div>
    `;
  }
});
