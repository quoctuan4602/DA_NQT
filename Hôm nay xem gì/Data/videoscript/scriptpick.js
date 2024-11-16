document.addEventListener("DOMContentLoaded", function () {
  const user = localStorage.getItem("userInf");
  if (!user) {
    document.getElementById(
      "usermenu"
    ).innerHTML = `<a class="text-white btn btn-primary me-5" href="./login.html">
          Đăng nhập
        </a>`;
  } else {
    document.getElementById("usermenu").innerHTML = `
        <div class="dropdown">
        <button class=" bg-transparent border-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
          <image src="./Data/logo/avatar.png" style="width:40px">
          </image>
          </button>
      <ul class="dropdown-menu">
        ${
          user.role === "admin"
            ? `<li>
            <a class="dropdown-item" href="./cretaeMovie.html">
              Tạo Phim
            </a>
          </li>`
            : ""
        }
        <li><a class="dropdown-item" href="./updateUser.html">Cập nhật thông tin người dùng</a></li>
        <li><a class="dropdown-item" href="/logout.html">Logout</a></li>
      </ul>
    </div>
    `;
  }

  let filmID = "";
  const fetchMovieDate = async () => {
    fetch("http://localhost:3000/films")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then((res) => {
        let filmRennder = "";
        let index = Math.floor(Math.random() * (res.length + 1));
        filmId = res[index]._id;
        filmRennder += `<div class="card  mb-3 " style="background:black">
          <div class="border d-flex ">
            <img src="http://localhost:3000/uploads/${
              res[index]?.image
            }" class="card-img-top image_size"  alt="..." >
            <div class="">
              <h5 class="text-white filmname">${res[index]?.name}</h5>
              <h5 class="text-white bordered-class">Thể loại: ${
                res[index]?.type ? res[index].type : "Không"
              }</h5>
              <p class="text-white bordered-paragraph ">Mô tả: ${
                res[index]?.description
              }</p>
              <p class="p-4 " id="rating">`;
        for (let i = 1; i < 10; i++) {
          filmRennder += `<i data-id="${i}" class="fa-solid ${
            i < res[index].rateCount / res[index].ratePeopleCount
              ? "text-warning"
              : ""
          } fa-star"></i>`;
        }
        filmRennder += `</p>
        <div class="p-4" id="rate_avagere">
        Trung Binh : ${(
          res[index].rateCount / res[index].ratePeopleCount
        ).toFixed(2)}}
        </div>
        <p>
        </p>
                  </div>
                  </div>
                  <button id="watchFilm" class="btn btn-warning mt-3">Xem Trailer</button>
                  </div>
              <video id='videoRef' src='http://localhost:3000/uploads/${
                res[index]?.video
              }' width='100%' controls="controls" preload="none"></video>
              `;
        filmID = res[index]._id;
        document.getElementById("#genreselected").innerHTML = filmRennder;
        localStorage.setItem("filmId", res[index]._id);
        fetchMovieComment();
        document.getElementById("watchFilm").addEventListener("click", () => {
          document.getElementById("videoRef").play();
          const videoElement = document.getElementById("videoRef");
          const rect = videoElement.getBoundingClientRect();
          window.scrollTo(1000, 1000);
        });

        $(".fa-star").each(function () {
          $(this).on("click", function () {
            let currentRate = parseInt($(this).attr("data-id"));
            $(".fa-star").removeClass("text-warning");
            $(".fa-star").each(function (index) {
              if (index < currentRate) {
                $(this).addClass("text-warning");
              }
            });

            fetch(`http://localhost:3000/films/rating`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                filmId: filmID,
                rating: currentRate,
              }),
            })
              .then((response) => {
                if (!response.ok) {
                  throw new Error(
                    "Network response was not ok " + response.statusText
                  );
                }
                alert("Bạn đã đánh giá thành công.");
                window.location.reload();
              })
              .catch((error) => {
                console.error(
                  "There was a problem with the edit operation:",
                  error
                );
              });
          });
        });
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  const fetchMovieComment = async (commentLimit) => {
    fetch(
      "http://localhost:3000/comments/film/" + filmID + "?limit=" + commentLimit
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then((res) => {
        let comment = "";
        res.forEach((item) => {
          const { userDisLike, userLike } = item;
          const user = JSON.parse(localStorage.getItem("userInf"));
          const { role } = user;

          comment += `
          <div class="d-flex gap-3 border p-2 mb-2" id="comment-${item._id}">
  <img
    width="64px"
    height="64px"
    class="mr-3"
    src="./Data/logo/useravt.jpg"
    alt="User image"
  />
  <div class="d-flex w-100 justify-content-between media-body text-black">
    <div>
      <h5 class="mt-0">${item?.userId?.fullName} ${
            item?.commened === "commened"
              ? "👍 Dề xuất"
              : item?.commened === "uncommened"
              ? "👎 Không đề xuất"
              : ""
          }</h5>
      <p class="m-0">${item?.commentTxt}</p>
      <span class="likeSpan" data-id="${item._id}">
        <i data-id="${item._id}" class="likeIcon ${
            userLike.includes(user._id)
              ? "fa-solid fa-thumbs-up "
              : "fa-regular fa-thumbs-up"
          }"></i>
      </span>
      <span  class="likeCount" data-id="${item._id}">${item.likeCount}</span>
      <span class="dislikeSpan"  data-id="${item._id}">
       <i data-id="${item._id}" class="dislikeIcon  ${
            userDisLike.includes(user._id)
              ? "fa-solid fa-thumbs-down "
              : "fa-regular fa-thumbs-down"
          }"></i>
      </span>
      <span  class="disLikeCount" data-id="${item._id}">${
            item.disLikeCount
          }</span>
      <button>
        <i class="fa-solid fa-reply"></i> Trả lời
      </button>
    </div>
    
    <!-- Dropdown for Edit and Delete -->
    <div class="dropdown  ${
      role === "admin"
        ? "d-block"
        : role === "user" && item.userId._id === user._id
        ? "d-block"
        : "d-none"
    }">
      <button class="btn" type="button">
       ⋮
      </button>
      <div class="dropdown-menu">
      ${
        role === "admin"
          ? `<button class="dropdown-item delete-btn" data-comment-id="${item._id}">Delete</button>`
          : role === "user" && item.userId._id === user._id
          ? `<button class="dropdown-item edit-btn" data-comment-id="${item._id}">Edit</button>
                 <button class="dropdown-item delete-btn" data-comment-id="${item._id}">Delete</button>`
          : ""
      }
      </div>
    </div>
  </div>
</div>
          </div>
        `;
        });
        document.getElementById("comments").innerHTML = comment;

        // Add event listeners to all edit buttons
        const editButtons = Array.from(
          document.getElementsByClassName("edit-btn")
        );
        editButtons.forEach((button) => {
          button.addEventListener("click", function () {
            const commentId = this.getAttribute("data-comment-id");
            editComment(commentId);
          });
        });

        // Add event listeners to all delete buttons
        const deleteButtons = Array.from(
          document.getElementsByClassName("delete-btn")
        );
        deleteButtons.forEach((button) => {
          button.addEventListener("click", function () {
            const commentId = this.getAttribute("data-comment-id");
            deleteComment(commentId);
          });
        });

        // Add event listeners to all like and dislike buttons
        likeAndDislikeEvent();
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  function likeAndDislikeEventCall(commentId, type, element) {
    const user = JSON.parse(localStorage.getItem("userInf"));
    const { _id } = user;
    const data = { userId: _id, commentId, type };

    fetch(`http://localhost:3000/comments/update/${commentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json(); // Return parsed JSON
      })
      .then((res) => {
        const { likeCount, disLikeCount } = res.data;

        // Use the passed `element` to get the correct data-id
        const dataIdValue = element.getAttribute("data-id");

        // Update the like count element
        const elementLikeCount = document.querySelector(
          `span[data-id="${dataIdValue}"].likeCount`
        );
        if (type) {
          const iElementLike = document.querySelector(
            `i[data-id="${dataIdValue}"].likeIcon` // Assuming like icon is an <i> element with class .like
          );
          if (iElementLike) toggleLikeIcon(iElementLike);
        }

        // Update the dislike count element
        const elementDisLikeCount = document.querySelector(
          `span[data-id="${dataIdValue}"].disLikeCount` // Assuming dislike count element has class .disLikeCount
        );
        if (!type) {
          const iElementDisLike = document.querySelector(
            `i[data-id="${dataIdValue}"].dislikeIcon` // Assuming dislike icon is an <i> element with class .dislike
          );
          if (iElementDisLike) toggleLikeIcon(iElementDisLike);
        }

        // Update the displayed counts
        if (elementLikeCount) elementLikeCount.textContent = likeCount;
        if (elementDisLikeCount) elementDisLikeCount.textContent = disLikeCount;
      })
      .catch((error) => {
        console.error("There was a problem with the edit operation:", error);
      });
  }

  function toggleLikeIcon(element) {
    if (element.classList.contains("fa-solid")) {
      element.classList.remove("fa-solid");
      element.classList.add("fa-regular");
    } else {
      element.classList.remove("fa-regular");
      element.classList.add("fa-solid");
    }
  }

  function likeAndDislikeEvent() {
    document.querySelectorAll(".likeSpan").forEach(function (element) {
      element.addEventListener("click", async function () {
        const commentId = this.getAttribute("data-id");
        likeAndDislikeEventCall(commentId, true, this);
      });
    });

    document.querySelectorAll(".dislikeSpan").forEach(function (element) {
      element.addEventListener("click", async function () {
        const commentId = this.getAttribute("data-id");
        likeAndDislikeEventCall(commentId, false, this);
      });
    });
  }
  // Function to handle editing a comment
  const editComment = (commentId) => {
    // Retrieve the comment text element
    const commentTextElement = document.querySelector(
      `#comment-${commentId} p`
    );
    const currentText = commentTextElement.textContent;

    // Replace the text with an editable input field and a save button
    commentTextElement.innerHTML = `
    <input type="text" value="${currentText}" id="edit-input-${commentId}" />
    <button id="${commentId}" onclick="saveComment('${commentId}')">Save</button>
  `;

    // Function to save the edited comment
    const saveComment = (commentId) => {
      const editedText = document.getElementById(
        `edit-input-${commentId}`
      ).value;

      // Call the API to update the comment
      fetch(`http://localhost:3000/comments/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ commentTxt: editedText }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              "Network response was not ok " + response.statusText
            );
          }
          // Update the comment text in the DOM
          const commentTextElement = document.querySelector(
            `#comment-${commentId} p`
          );
          commentTextElement.textContent = editedText;
        })
        .catch((error) => {
          console.error("There was a problem with the edit operation:", error);
        });
    };

    document.getElementById(commentId).addEventListener("click", () => {
      saveComment(commentId);
    });
  };

  // Function to call the delete API
  const deleteComment = (commentId) => {
    fetch(`http://localhost:3000/comments/${commentId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        // Remove the comment from the DOM if the delete is successful
        document.getElementById(`comment-${commentId}`).remove();
      })
      .catch((error) => {
        console.error("There was a problem with the delete operation:", error);
      });
  };

  fetchMovieDate();

  let commentLimit = 5;
  document
    .getElementById("showMoreComments")
    .addEventListener("click", async function (event) {
      commentLimit = commentLimit + 5;
      fetchMovieComment(commentLimit);
    });

  document
    .getElementById("commentForm")
    .addEventListener("submit", async function (event) {
      event.preventDefault();
      const filmId = localStorage.getItem("filmId");
      const commentText = document.getElementById("comment").value;
      const user = JSON.parse(localStorage.getItem("userInf"));
      if (!user) {
        alert("Vui lòng đăng nhập để bình luận");
        return;
      } else {
        // Prepare data to send
        const data = {
          filmId: filmId,
          userId: user._id,
          commentTxt: commentText,
        };
        try {
          // Send POST request to server
          const response = await fetch("http://localhost:3000/comments/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });

          if (!response.ok) {
            throw new Error("Lỗi khi gửi bình luận");
          }

          // Handle success response
          const result = await response.json();

          document.getElementById("comments").insertAdjacentHTML(
            "beforeend",
            `
          <div class="d-flex gap-3 mb-2" id="comment-${result._id}">
            <img
            width="64px"
            height="64px"
              class="mr-3"
              src="./Data/logo/useravt.jpg"
              alt="User image"
            />
            <div class="media-body text-black">
              <h5 class="mt-0">${user?.fullName}</h5>
              <p class="m-0">${result?.commentTxt}</p>
              <button class="edit-btn" data-comment-id="${result._id}">Sua</button>
              <button class="delete-btn" data-comment-id="${result._id}">Delete</button>
            </div>
          </div>
        `
          );

          // Optionally clear the comment form
          document.getElementById("commentForm").reset();
        } catch (error) {
          // Handle errors
          console.error("Error:", error);
          alert("Có lỗi xảy ra khi gửi bình luận");
        }
      }
    });
});
