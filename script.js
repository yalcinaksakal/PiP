"use sttrict";
// const displayMediaStreamConstraints = {
//   video: true,
// };

const videoElement = document.getElementById("video");
const btnStart = document.getElementById("btn-start");
const btnSelect = document.getElementById("btn-select");

// const timeout = function (s) {
//   return new Promise(function (_, reject) {
//     setTimeout(function () {
//       reject(new Error(`Request took too long! Timeout after ${s} second`));
//     }, s * 1000);
//   });
// };

async function selectMediaStream() {
  try {
    // const mediaStream = await Promise.race([
    //   navigator.mediaDevices.getDisplayMedia(),
    //   timeout(5),
    // ]);

    const mediaStream = await navigator.mediaDevices.getDisplayMedia();

    getSupportedConstraints();
    if (!mediaStream) throw new Error("Couldnt get media stream");
    videoElement.srcObject = mediaStream;
    videoElement.onloadedmetadata = () => {
      videoElement.play();
    };
  } catch (err) {
    console.log(err);
  }
}

function toogleButton() {
  btnSelect.disabled = !btnSelect.disabled;
  btnStart.disabled = !btnStart.disabled;
}

function stopCapture() {
  if (videoElement.srcObject)
    videoElement.srcObject.getTracks().forEach(track => track.stop());
  videoElement.srcObject = null;
}

function disposeVideo() {
  videoElement.pause();
  videoElement.removeAttribute("src"); // empty source
  videoElement.load();
}

btnSelect.addEventListener("click", async () => {
  stopCapture();
  disposeVideo();

  toogleButton();
  if (document.pictureInPictureElement) await document.exitPictureInPicture();

  await selectMediaStream();
});

btnStart.addEventListener("click", async () => {
  toogleButton();
  await videoElement.requestPictureInPicture();
});
