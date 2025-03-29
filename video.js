import { changeMainHeight } from "./nav_and_main_functions.js";

const baseline = document.querySelector(".progress-baseline");

document.querySelector(".video").addEventListener("loadeddata", () => {
  document.querySelector(".loading").remove();
  document.querySelector(".controls").classList.add("show");
  changeMainHeight();

  baseline.addEventListener("click", changeCurrentTime);
});

document.querySelector(".fullscreen").addEventListener("click", () => {
  if (!document.fullscreenElement) {
    document.querySelector(".video-wrapper").requestFullscreen();
    const videoMenus = Array.from(document.querySelectorAll(".video-menu"));
    videoMenus.forEach(item => item.classList.add("fullscreen"));
  } else {
    document.exitFullscreen();
    const videoMenus = Array.from(document.querySelectorAll(".video-menu"));
    videoMenus.forEach(item => item.classList.remove("fullscreen"));
  }
})

const video = document.querySelector(".video");
let speed = 1;
let tick = null;

document.querySelector(".video-wrapper").addEventListener("click", toggleVideoPlaying);

function toggleVideoPlaying(event) {
  let parent = event.target;
  while (parent) {
    parent = parent.parentElement;
    if (parent?.classList.contains("controls")) {
      break;
    }
  }

  if (!parent || event.target.classList.contains("play-pause") || event.target.parentElement.classList.contains("play-pause")) {
    const image = document.querySelector(".play-pause img");
    if (video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2) {
      video.pause();
      clearInterval(tick);
      image.src = "./assets/play.png";
      image.alt = "Продолжить воспроизведение";
    } else if (video.currentTime == 0 && video.readyState > 2 || video.paused) {
      video.play();
      image.src = "./assets/pause-button.png";
      image.alt = "Остановить воспроизведение";
      tick = setInterval(() => {
        moveThumb();
        changeProgressWidth();
      }, 1000 / speed);
    }
  }
}

function moveThumb(pos = null) {
  const maxPos = baseline.parentElement.parentElement.getBoundingClientRect().width - 73 - 64;
  if (!pos) {
    const newPosition = video.currentTime / video.duration * maxPos;
    document.querySelector(".video-thumb").style.left = `${newPosition - 7.5}px`;
  } else {
    document.querySelector(".video-thumb").style.left = `${Math.min(pos, maxPos) - 8}px`;
  }
}

function changeProgressWidth(width = null) {
  const maxWidth = baseline.parentElement.parentElement.getBoundingClientRect().width - 73 - 64;
  if (!width) {
    const newWidth = video.currentTime / video.duration * maxWidth;
    document.querySelector(".progress").style.width = `${Math.min(newWidth + 2.5, maxWidth)}px`;
  }
  else {
    document.querySelector(".progress").style.width = `${Math.min(width + 2.5, maxWidth)}px`;
  }
}

window.addEventListener("resize", () => {
  moveThumb();
  changeProgressWidth();
});

document.querySelector(".video-thumb").addEventListener("mousedown", () => {
  document.addEventListener("mousemove", changeCurrentTime);

  document.body.addEventListener("mouseup", () => {
    document.removeEventListener("mousemove", changeCurrentTime);
  });
});


function changeCurrentTime(event) {
  let x = event.x - baseline.getBoundingClientRect().left;

  const maxWidth = baseline.parentElement.parentElement.getBoundingClientRect().width - 73 - 64;
  if (x < 0) x = 0;
  if (x > maxWidth) x = maxWidth;

  let newTime = x / baseline.offsetWidth * video.duration;
  newTime = `${newTime}`;

  video.currentTime = newTime;
  moveThumb(x);
  changeProgressWidth(x);
}

video.addEventListener("ended", () => {
  clearInterval(tick);
  document.querySelector(".play-pause").firstElementChild.src = "./assets/play.png"; //надо будет поменять
  document.querySelector(".play-pause").firstElementChild.alt = "Воспроизвести заново";
  document.querySelector(".play-pause").addEventListener("click", returnToStart);
});

function returnToStart() {
  moveThumb(0);
  changeProgressWidth(0);

  document.querySelector(".play-pause").removeEventListener("click", returnToStart);
}

document.body.addEventListener("click", (event) => {
  const allMenus = document.querySelectorAll(".video-menu");
  if (event.target.classList.contains("video-button") || event.target.parentElement.classList.contains("video-button")) {
    const videoMenu = event.target.querySelector(".video-menu") || event.target.parentElement.querySelector(".video-menu");
    if (videoMenu) {
      videoMenu.classList.toggle("show");
      for (let menu of allMenus) {
        if (menu !== videoMenu) menu.classList.remove("show");
      }
    } else {
      for (let menu of allMenus) {
        menu.classList.remove("show");
      }
    }
  } else {
    let parent = event.target;
    while (parent) {
      parent = parent.parentElement;
      if (parent?.classList.contains("video-menu")) break
    }
    if (!parent) {
      for (let menu of allMenus) {
        menu.classList.remove("show");
      }
    }
  }
});

document.body.addEventListener("click", (event) => {
  if (event.target.classList.contains("speed-option")) {
    video.playbackRate = event.target.innerHTML;
    speed = event.target.innerHTML;
  }
});
