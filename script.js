// -------------------------------
// VARIABLES PLACE
// -------------------------------

// --- DOM ELEMENTS ---
const
    videoElement = document.querySelector('.video'),
    captureButton = document.querySelector('.capture-button'),
    showStreamButton = document.querySelector('.show-stream'),
    eyeImage = document.querySelector('.show-stream img');


// --- STATE OF THE PICTURE IN PICTURE ---
let 
    pictureIsInPicture = false,
    mediaStreamExists = false;


// ------------------------------------
// WORKING WITH THE SCREEN CAPTURE API
// ------------------------------------

async function selectMediaStream() {
    try {

        // => capturing screen contents as a live mediaStream
        const mediaStream = await navigator.mediaDevices.getDisplayMedia();
        console.log('media stream => \n', mediaStream);

        // => link the media stream with the video element, to have a stage
        videoElement.srcObject = mediaStream;

        // => activate the media stream automatically
        videoElement.onloadedmetadata = async () => {
            videoElement.play();
        };
        
        mediaStreamExists = videoElement.srcObject;

    } catch (error) {
      alert(error);
    }
  }


// => stop current stream 
const stopStreamedVideo = (videoElem) => {
    const stream = videoElem.srcObject;
    const tracks = stream.getTracks();

    tracks.forEach((track) => {
        console.log('track', track);
        track.stop();
    });

    videoElem.srcObject = null;
    mediaStreamExists = videoElem.srcObject;
    }


// => show the captured media stream
captureButton.addEventListener('click', async () => {
    captureButton.disabled = true;

    // console.log('Video Element srcObject', videoElement.srcObject);
    // console.log('media stream exists', mediaStreamExists);

    if(!mediaStreamExists){
       await selectMediaStream();
    }
    else if(mediaStreamExists){
        console.log('a media stream exists');
        console.log('srcObject', videoElement.srcObject);

        stopStreamedVideo(videoElement);
        console.log('srcObject after stop streaming', videoElement.srcObject);

        // => if no stream exist, capture a new target
        mediaStreamExists || await selectMediaStream();
    }

    captureButton.disabled = false;
    captureButton.innerHTML = !mediaStreamExists ? 'Capture' : 'New Capture' ;
    showStreamButton.style.display = !mediaStreamExists ? 'none' : 'block';
});


// note: 
// the requestPictureInPicture method needs an explicit user action and can`t start automatically

// => show or hide the stream 
showStreamButton.addEventListener('click', async()=>{
    if(!pictureIsInPicture){
        // => call the requestPictureInPicture method of the HTMLVideoElement
        await videoElement.requestPictureInPicture();

        pictureIsInPicture = true;

    } else if (pictureIsInPicture) {
        try{
            // => close the picture in picture
            await document.exitPictureInPicture();

            pictureIsInPicture = false;

        } catch(error) {
            console.log('failed to exit picture in picture', error);
            stopStreamedVideo(videoElement);
            location.reload();
        }
      
    }

    eyeImage.src = !pictureIsInPicture ? './view.png' : './hide.png';
})
