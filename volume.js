const video = document.querySelector(".video");
const volumeBaseline = document.querySelector(".volume-baseline");
const progress = document.querySelector(".current-volume");
const thumb = document.querySelector(".volume-thumb");
let maxWidth = 0;

document.querySelector(".volume").addEventListener("click", () => {
  setTimeout(() => {
    if (document.querySelector(".volume-menu").classList.contains("show") && !maxWidth) {
      maxWidth = volumeBaseline.offsetWidth - 1;
    }
  }, 0)
})

function moveVolumeThumb(pos = null) {
  thumb.style.left = `${Math.min(pos, maxWidth) - 5}px`;
}

function changeVolumeProgressWidth(width = null) {
  progress.style.width = `${Math.min(width + 2.5, maxWidth)}px`;
}

window.addEventListener("resize", () => {
  if (document.querySelector(".volume-menu").classList.contains("show")) {
    moveVolumeThumb();
    changeVolumeProgressWidth();
  }
});

thumb.addEventListener("mousedown", () => {
  document.addEventListener("mousemove", handleVolumeChange);

  document.body.addEventListener("mouseup", () => {
    document.removeEventListener("mousemove", handleVolumeChange);
  });
});


function handleVolumeChange(event) {
  let x = event.x - volumeBaseline.getBoundingClientRect().left;
  if (x < 0) x = 0;
  if (x > maxWidth) x = maxWidth;

  newVolume = x / maxWidth;
  newVolume = `${newVolume.toFixed(2)}`;

  video.volume = newVolume;
  moveVolumeThumb(x);
  changeVolumeProgressWidth(x);
  document.querySelector(".volume-value").innerHTML = (newVolume * 100).toFixed(0);
}

volumeBaseline.addEventListener("click", handleVolumeChange);