const socket = io('/');
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;

var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '443'
});

let myVideoStream;
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(
    stream => {
        myVideoStream = stream;
        addVideoStream(myVideo, stream);

        peer.on('call', call => {
            call.answer(stream);
            const video = document.createElement('video');
            call.on('stream', userVideoStream => {
                addVideoStream(video, userVideoStream)
            })
        })

        socket.on('user-connected', (userId)=> {
            connectToNewUser(userId, stream);
        })
        let text = $('input');
        $('html').keydown((e) => {
            if(e.which == 13 && text.val().length !== 0){
                socket.emit('message', text.val());
                text.val('');
            }
        })

        socket.on('createMessage', message => {
            $('.messages').append(`<li class="message"> <b>user </b> <br /> ${message} </li>`);
            scrollToBottom();
        })
    }
)

peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id)
});


const connectToNewUser = (userId) => {
    const call = Peer.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
}

const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    videoGrid.append(video);
}


const scrollToBottom = () => {
    var d = $('.main-chat-window');
    d.scrollTop(d.prop('scrollheight'));
}


const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if(enabled){
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    } else {
        myVideoStream.getAudioTracks()[0].enabled = true;
        setMuteButton();
    }
}

const setMuteButton = () =>{
    const html =`<i class="fas fa-microphone"></i> <span>Mute</span>`;
    document.querySelector('.main-mute-button').innerHTML = html;
}

const setUnmuteButton = () =>{
    const html =`<i class="fas fa-microphone-slash"></i> <span>unMute</span>`;
    document.querySelector('.main-mute-button').innerHTML = html;
}


const playStop = () => {
    const enabled = myVideoStream.getVideoTracks()[0].enabled;
    if(enabled){
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlayVideo();
    } else {
        myVideoStream.getVideoTracks()[0].enabled = true;
        setStopVideo();
    }
}

const setStopVideo = () =>{
    const html =`<i class="fas fa-video"></i> <span>Stop Video</span>`;
    document.querySelector('.main-video-button').innerHTML = html;
}

const setPlayVideo = () =>{
    const html =`<i class="fas fa-video-slash"></i> <span>Play Video</span>`;
    document.querySelector('.main-video-button').innerHTML = html;
}
