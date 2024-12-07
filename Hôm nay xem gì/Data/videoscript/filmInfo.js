document.addEventListener('DOMContentLoaded', function () {
  const user = JSON.parse(localStorage.getItem('userInf'));
  console.log('🚀 ~ user:', user);
  if (!user) {
    document.getElementById(
      'usermenu',
    ).innerHTML = `<a class="text-white btn btn-primary me-5" href="./login.html">
          Đăng nhập
        </a>`;
  } else {
    document.getElementById('usermenu').innerHTML = `
        <div class="dropdown">
        <button  class="me-5 bg-transparent border-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
          <image src="${
            user.avatar
              ? 'http://localhost:3000/uploads/' + user.avatar
              : './Data/logo/avatar.png'
          }" style="width:40px">
          </image>
          </button>
      <ul class="dropdown-menu">
      ${
        user.role === 'admin'
          ? `<li>
            <a class="dropdown-item" href="./cretaeMovie.html">
              Tạo Phim
            </a>
            <a class="dropdown-item" href="./listUser.html">
              Danh sách người dùng
            </a>
          </li>`
          : ''
      }
        <li><a class="dropdown-item" href="./updateUser.html">Cập nhật thông tin người dùng</a></li>
        <li><a class="dropdown-item" href="./logout.html">Logout</a></li>
      </ul>
    </div>
    `;
  }

  let filmID = '';
  const fetchMovieDate = async () => {
    const urlParams = new URLSearchParams(window.location.search);

    // Get the value of a specific parameter, e.g., 'id'
    const paramValue = urlParams.get('id');
    fetch('http://localhost:3000/films/filmId/' + paramValue)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then((res) => {
        let filmRennder = '';
        filmId = res._id;

        filmRennder += `<div class="card  mb-3 position-relative " style="background:black">
          ${
            user?.role == 'admin'
              ? `<a
                class="position-absolute end-0"
                href="./updateFilm.html?id=${filmId}"
              >
                <i class="fa-regular fa-pen-to-square"></i>
              </a>`
              : ''
          }
          
          <div class="border d-flex ">
            <img src="http://localhost:3000/uploads/${
              res?.image
            }" class="card-img-top image_size"  alt="..." >
            <div class="">
              <h5 class="text-white filmname">${res?.name}</h5>
              <h5 class="text-white bordered-class">Thể loại: ${
                res?.type ? res.type.name : 'Không'
              }</h5>
              <p class="text-white bordered-paragraph ">Mô tả: ${
                res?.description
              }</p>
              <p class="p-4 " id="rating">`;
        for (let i = 1; i < 10; i++) {
          filmRennder += `<i data-id="${i}" class="fa-solid ${
            i < res.rateCount / res.ratePeopleCount ? 'text-warning' : ''
          } fa-star"></i>`;
        }
        filmRennder += `</p>
        <div class="p-4" id="rate_avagere">
        Trung Binh : ${res.star}
        </div>
        <div class="p-4" id="rate_avagere">
        Đạo diễn : ${res.actor ? res.actor : 'Unknown'}
        </div>
        <div class="p-4" id="rate_avagere">
       Diễn viên : ${res.director ? res.director : 'Unknown'}
        </div>
        <p>
        </p>
                  </div>
                  </div>
                  <button id="watchFilm" class="btn btn-warning mt-3">Xem Trailer</button>
                  </div>
              <video id='videoRef' src='http://localhost:3000/uploads/${
                res?.video
              }' width='100%' controls="controls" preload="none"></video>
              `;
        filmID = res._id;
        document.getElementById('#genreselected').innerHTML = filmRennder;
        localStorage.setItem('filmId', res._id);
        fetchMovieComment();
        document.getElementById('watchFilm').addEventListener('click', () => {
          document.getElementById('videoRef').play();
          const videoElement = document.getElementById('videoRef');
          window.scrollTo(1000, 1000);
        });

        $('.fa-star').each(function () {
          $(this).on('click', function () {
            if (user) {
              let currentRate = parseInt($(this).attr('data-id'));
              $('.fa-star').removeClass('text-warning');
              $('.fa-star').each(function (index) {
                if (index < currentRate) {
                  $(this).addClass('text-warning');
                }
              });

              fetch(`http://localhost:3000/films/rating`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  filmId: filmID,
                  rating: currentRate,
                }),
              })
                .then((response) => {
                  if (!response.ok) {
                    throw new Error(
                      'Network response was not ok ' + response.statusText,
                    );
                  }
                  Toastify({
                    text: 'Bạn đã đánh giá thành công.',
                    className: 'info',
                    style: {
                      background: 'linear-gradient(to right, #00b09b, #96c93d)',
                    },
                  }).showToast();
                })
                .catch((error) => {
                  console.error(
                    'There was a problem with the edit operation:',
                    error,
                  );
                });
            } else {
              Toastify({
                text: 'Bạn cần đăng nhập để đánh giá.',
                className: 'error',
                style: {
                  background: 'linear-gradient(to right, #dc3545, #f8312f)',
                },
              }).showToast();
            }
          });
        });
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
  };

  const fetchMovieComment = async (commentLimit) => {
    fetch(
      'http://localhost:3000/comments/film/' +
        filmID +
        '?limit=' +
        commentLimit,
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then((res) => {
        let comment = '';
        res.forEach((item) => {
          const { userDisLike, userLike } = item;
          console.log('🚀 ~ res.forEach ~ item:', item);
          const user = JSON.parse(localStorage.getItem('userInf'));
          const { role } = user;

          comment += `
          <div class="d-flex gap-3 border p-2 mb-2" id="comment-${item._id}">
  <img
    width="64px"
    height="64px"
    class="mr-3 "
    src=${
      item?.userId?.avatar
        ? 'http://localhost:3000/uploads/' + item?.userId?.avatar
        : './Data/logo/useravt.jpg'
    }
    alt="User image"
  />
  <div class="d-flex w-100 justify-content-between media-body text-black">
    <div>
      <h5 class="mt-0">${item?.userId?.fullName} ${
            item?.commened === 'commened'
              ? '👍 Dề xuất'
              : item?.commened === 'uncommened'
              ? '👎 Không đề xuất'
              : ''
          }</h5>
      <p class="m-0">${item?.commentTxt}</p>
      <span class="likeSpan" data-id="${item._id}">
        <i data-id="${item._id}" class="likeIcon ${
            userLike.includes(user._id)
              ? 'fa-solid fa-thumbs-up '
              : 'fa-regular fa-thumbs-up'
          }"></i>
      </span>
      <span  class="likeCount" data-id="${item._id}">${item.likeCount}</span>
      <span class="dislikeSpan"  data-id="${item._id}">
       <i data-id="${item._id}" class="dislikeIcon  ${
            userDisLike.includes(user._id)
              ? 'fa-solid fa-thumbs-down '
              : 'fa-regular fa-thumbs-down'
          }"></i>
      </span>
      <span  class="disLikeCount" data-id="${item._id}">${
            item.disLikeCount
          }</span>
      <button class="reply" rep-of="${item.userId._id}" data-id="${item._id}">
        <i class="fa-solid fa-reply"></i> Trả lời
      </button>
      <div class="replies">
         ${(() => {
           let repliesHtml = '';
           item.replies.forEach((reply) => {
             repliesHtml += `
        <div class="d-flex gap-3 border p-2 mb-2" id="comment-${reply._id}">
  <img
    width="64px"
    height="64px"
    class="mr-3"
    src=${
      reply?.userId?.avatar
        ? 'http://localhost:3000/uploads/' + reply?.userId?.avatar
        : './Data/logo/useravt.jpg'
    }
    alt="User image"
  />
  <div class="d-flex w-100 justify-content-between media-body text-black">
    <div>
      <h5 class="mt-0">${reply?.userId?.fullName}</h5>
      <p class="m-0">${reply?.commentTxt}</p>
      <span class="likeSpan" data-id="${reply._id}">
        <i data-id="${reply._id}" class="likeIcon ${
               userLike.includes(user._id)
                 ? 'fa-solid fa-thumbs-up '
                 : 'fa-regular fa-thumbs-up'
             }"></i>
      </span>
      <span  class="likeCount" data-id="${reply._id}">${reply.likeCount}</span>
      <span class="dislikeSpan"  data-id="${reply._id}">
       <i data-id="${reply._id}" class="dislikeIcon  ${
               userDisLike.includes(user._id)
                 ? 'fa-solid fa-thumbs-down '
                 : 'fa-regular fa-thumbs-down'
             }"></i>
      </span>
      <span  class="disLikeCount" data-id="${reply._id}">${
               reply.disLikeCount
             }</span>
      <button class="reply" rep-of="${reply.userId._id}"  data-id="${
               reply._id
             }">
        <i class="fa-solid fa-reply"></i> Trả lời
      </button>
    </div>
    
    <!-- Dropdown for Edit and Delete -->
    <div class="dropdown  ${
      role === 'admin'
        ? 'd-block'
        : role === 'user' && reply.userId._id === user._id
        ? 'd-block'
        : 'd-none'
    }">
      <button class="btn" type="button">
       ⋮
      </button>
      <div class="dropdown-menu">
      ${
        role === 'admin'
          ? `<button class="dropdown-item delete-btn" data-comment-id="${reply._id}">Delete</button>`
          : role === 'user' && reply.userId._id === user._id
          ? `<button class="dropdown-item edit-btn" data-comment-id="${reply._id}">Edit</button>
                 <button class="dropdown-item delete-btn" data-comment-id="${reply._id}">Delete</button>`
          : ''
      }
      </div>
    </div>
  </div>
</div>
          </div>
      `;
           });
           return repliesHtml; // Return the generated HTML
         })()}
      </div>
    </div>
    
    <!-- Dropdown for Edit and Delete -->
    <div class="dropdown  ${
      role === 'admin'
        ? 'd-block'
        : role === 'user' && item.userId._id === user._id
        ? 'd-block'
        : 'd-none'
    }">
      <button class="btn" type="button">
       ⋮
      </button>
      <div class="dropdown-menu">
      ${
        role === 'admin'
          ? `<button class="dropdown-item delete-btn" data-comment-id="${item._id}">Delete</button>`
          : role === 'user' && item.userId._id === user._id
          ? `<button class="dropdown-item edit-btn" data-comment-id="${item._id}">Edit</button>
                 <button class="dropdown-item delete-btn" data-comment-id="${item._id}">Delete</button>`
          : ''
      }
      </div>
    </div>
  </div>
</div>
          </div>
        `;
        });
        document.getElementById('comments').innerHTML = comment;

        // Add event listeners to all edit buttons
        const editButtons = Array.from(
          document.getElementsByClassName('edit-btn'),
        );
        editButtons.forEach((button) => {
          button.addEventListener('click', function () {
            const commentId = this.getAttribute('data-comment-id');
            editComment(commentId);
          });
        });

        // Add event listeners to all delete buttons
        const deleteButtons = Array.from(
          document.getElementsByClassName('delete-btn'),
        );
        deleteButtons.forEach((button) => {
          button.addEventListener('click', function () {
            const commentId = this.getAttribute('data-comment-id');
            deleteComment(commentId);
          });
        });

        // Add event listeners to all like and dislike buttons
        likeAndDislikeEvent();
        replyEvent();
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
  };

  function likeAndDislikeEventCall(commentId, type, element) {
    const user = JSON.parse(localStorage.getItem('userInf'));
    const { _id } = user;
    const data = { userId: _id, commentId, type };

    fetch(`http://localhost:3000/comments/update/${commentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json(); // Return parsed JSON
      })
      .then((res) => {
        const { likeCount, disLikeCount } = res.data;

        // Use the passed `element` to get the correct data-id
        const dataIdValue = element.getAttribute('data-id');

        // Update the like count element
        const elementLikeCount = document.querySelector(
          `span[data-id="${dataIdValue}"].likeCount`,
        );
        if (type) {
          const iElementLike = document.querySelector(
            `i[data-id="${dataIdValue}"].likeIcon`, // Assuming like icon is an <i> element with class .like
          );
          if (iElementLike) toggleLikeIcon(iElementLike);
        }

        // Update the dislike count element
        const elementDisLikeCount = document.querySelector(
          `span[data-id="${dataIdValue}"].disLikeCount`, // Assuming dislike count element has class .disLikeCount
        );
        if (!type) {
          const iElementDisLike = document.querySelector(
            `i[data-id="${dataIdValue}"].dislikeIcon`, // Assuming dislike icon is an <i> element with class .dislike
          );
          if (iElementDisLike) toggleLikeIcon(iElementDisLike);
        }

        // Update the displayed counts
        if (elementLikeCount) elementLikeCount.textContent = likeCount;
        if (elementDisLikeCount) elementDisLikeCount.textContent = disLikeCount;
      })
      .catch((error) => {
        console.error('There was a problem with the edit operation:', error);
      });
  }

  function toggleLikeIcon(element) {
    if (element.classList.contains('fa-solid')) {
      element.classList.remove('fa-solid');
      element.classList.add('fa-regular');
    } else {
      element.classList.remove('fa-regular');
      element.classList.add('fa-solid');
    }
  }

  function replyEvent() {
    document.querySelectorAll('.reply').forEach(function (element) {
      element.addEventListener('click', async function () {
        console.log(element);

        const commentId = this.getAttribute('data-id');
        const repOf = this.getAttribute('rep-of');

        // Show reply input (example)
        const replyInput = document.createElement('textarea');
        replyInput.placeholder = 'Write your reply...';
        replyInput.classList.add('form-control', 'd-inline');

        const submitButton = document.createElement('button');
        submitButton.textContent = 'Submit Reply';
        submitButton.setAttribute('ref-of', repOf);
        submitButton.classList.add('btn', 'btn-primary', 'd-inline');

        // Append the reply input and button to the comment
        const commentElement = document.querySelector(
          `[data-id="${commentId}"]`,
        );
        this.after(submitButton);
        this.after(replyInput);
        // Add event listener to the submit button to handle the form submission

        // Optionally, handle the submit action
        submitButton.addEventListener('click', function () {
          const user = JSON.parse(localStorage.getItem('userInf'));
          const commentTxt = replyInput.value;
          let parentCommentId = commentId;
          let userId = user._id;

          const data = {
            userId,
            commentTxt,
            parentCommentId,
            repOf,
            filmId: filmID,
          };

          fetch('http://localhost:3000/comments/replies', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          })
            .then((response) => {
              response.json();
              if (response.ok) {
                Toastify({
                  text: 'Trả lời thành công.',
                  className: 'info',
                  style: {
                    background: 'linear-gradient(to right, #00b09b, #96c93d)',
                  },
                }).showToast();
              } else {
                Toastify({
                  text: 'Trả lời thất bại.',
                  className: 'info',
                  style: {
                    background: 'linear-gradient(to right, #00b09b, #96c93d)',
                  },
                }).showToast();
              }
            })
            .catch((error) => {
              console.error('Error adding reply:', error);
            })
            .finally(() => {
              replyInput.remove();
              submitButton.remove();
              fetchMovieComment();
            });
        });
      });
    });
  }
  function likeAndDislikeEvent() {
    document.querySelectorAll('.likeSpan').forEach(function (element) {
      element.addEventListener('click', async function () {
        const commentId = this.getAttribute('data-id');
        likeAndDislikeEventCall(commentId, true, this);
      });
    });

    document.querySelectorAll('.dislikeSpan').forEach(function (element) {
      element.addEventListener('click', async function () {
        const commentId = this.getAttribute('data-id');
        likeAndDislikeEventCall(commentId, false, this);
      });
    });
  }
  // Function to handle editing a comment
  const editComment = (commentId) => {
    // Retrieve the comment text element
    const commentTextElement = document.querySelector(
      `#comment-${commentId} p`,
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
        `edit-input-${commentId}`,
      ).value;

      // Call the API to update the comment
      fetch(`http://localhost:3000/comments/update/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ commentTxt: editedText }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              'Network response was not ok ' + response.statusText,
            );
          }
          // Update the comment text in the DOM
          const commentTextElement = document.querySelector(
            `#comment-${commentId} p`,
          );
          commentTextElement.textContent = editedText;
        })
        .catch((error) => {
          console.error('There was a problem with the edit operation:', error);
        });
    };

    document.getElementById(commentId).addEventListener('click', () => {
      saveComment(commentId);
    });
  };

  // Function to call the delete API
  const deleteComment = (commentId) => {
    fetch(`http://localhost:3000/comments/delete/${commentId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        // Remove the comment from the DOM if the delete is successful
        document.getElementById(`comment-${commentId}`).remove();
      })
      .catch((error) => {
        console.error('There was a problem with the delete operation:', error);
      });
  };

  fetchMovieDate();

  let commentLimit = 5;
  document
    .getElementById('showMoreComments')
    .addEventListener('click', async function (event) {
      commentLimit = commentLimit + 5;
      fetchMovieComment(commentLimit);
    });

  document
    .getElementById('commentForm')
    .addEventListener('submit', async function (event) {
      event.preventDefault();
      const filmId = localStorage.getItem('filmId');
      const commentText = document.getElementById('comment').value;
      const selectedValue = document.querySelector(
        'input[name="commened"]:checked',
      );

      const user = JSON.parse(localStorage.getItem('userInf'));
      if (!user) {
        Toastify({
          text: 'Vui lòng đăng nhập để bình luận.',
          className: 'info',
          style: {
            background: 'linear-gradient(to right, #00b09b, #96c93d)',
          },
        }).showToast();
        return;
      } else {
        // Prepare data to send
        const data = {
          filmId: filmId,
          userId: user._id,
          commentTxt: commentText,
          commened: selectedValue.value,
        };
        try {
          // Send POST request to server
          const response = await fetch('http://localhost:3000/comments/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });

          // Handle success response
          const result = await response.json();
          const role = user.role;

          document.getElementById('comments').insertAdjacentHTML(
            'beforeend',
            `
        <div class="d-flex gap-3 border p-2 mb-2" id="comment-${result._id}">
  <img
    width="64px"
    height="64px"
    class="mr-3"
     src=${
       user?.avatar
         ? 'http://localhost:3000/uploads/' + user.avatar
         : './Data/logo/useravt.jpg'
     }
    alt="User image"
  />
  <div class="d-flex w-100 justify-content-between media-body text-black">
    <div>
      <h5 class="mt-0">${user.fullName} ${
              result?.commened === 'commened'
                ? '👍 Đề xuất'
                : result?.commened === 'uncommened'
                ? '👎 Không đề xuất'
                : ''
            }</h5>
      <p class="m-0">${result?.commentTxt}</p>
    </div>
    
    <!-- Dropdown for Edit and Delete -->
    <div class="dropdown">
      <div class="dropdown  ${
        role === 'admin'
          ? 'd-block'
          : role === 'user' && result.userId === user._id
          ? 'd-block'
          : 'd-none'
      }">
      <button class="btn" type="button">
       ⋮
      </button>
      <div class="dropdown-menu">
      ${
        role === 'admin'
          ? `<button class="dropdown-item delete-btn" data-comment-id="${result._id}">Delete</button>`
          : role === 'user' && result.userId === user._id
          ? `<button class="dropdown-item edit-btn" data-comment-id="${result._id}">Edit</button>
                 <button class="dropdown-item delete-btn" data-comment-id="${result._id}">Delete</button>`
          : ''
      }
      </div>
    </div>
  </div>
</div>
          </div>

        `,
          );

          // Optionally clear the comment form
          document.getElementById('commentForm').reset();
        } catch (error) {
          console.log('🚀 ~ error:', error);
          // Handle errors
          Toastify({
            text: 'Có lỗi xảy ra khi gửi bình luận.',
            className: 'info',
            style: {
              background: 'linear-gradient(to right, #00b09b, #96c93d)',
            },
          }).showToast();
        }
      }
    });
});
