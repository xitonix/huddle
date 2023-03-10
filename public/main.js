const container = document.getElementById("video-container");
const yourNameInput = document.getElementById("your-name-input");
const form = document.getElementById("huddle-form");
const screenForm = document.getElementById("screen-form");

const startRoom = async (event) => {
    // prevent a page reload when a user submits the form
    event.preventDefault();
    // hide the join form
    form.style.visibility = "hidden";

    // fetch an Access Token from the join-room route
    const response = await fetch("/token", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_identity: yourNameInput.value }),
    });
    const { token, room_name } = await response.json();
    const room = await joinRoom(room_name, token);
    // render the local and remote participants' video and audio tracks
    handleConnectedParticipant(room.localParticipant);
    room.participants.forEach(handleConnectedParticipant);
    room.on("participantConnected", handleConnectedParticipant);
    room.on("participantDisconnected", handleDisconnectedParticipant);
    window.addEventListener("pagehide", () => room.disconnect());
    window.addEventListener("beforeunload", () => room.disconnect());
};

const handleConnectedParticipant = (participant) => {
    // create a div for this participant's tracks
    const participantDiv = document.createElement("div");
    participantDiv.setAttribute("id", participant.identity);
    container.appendChild(participantDiv);

    // iterate through the participant's published tracks and
    // call `handleTrackPublished` on them
    participant.tracks.forEach((trackPublication) => {
        handleTrackPublished(trackPublication, participant);
    });

    // listen for any new track publications
    participant.on("trackPublished", (trackPublication) => {
        handleTrackPublished(trackPublication, participant);
    })
    screenForm.style.visibility = "visible"
    screenForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        // https://www.twilio.com/docs/video/screen-capture-chrome
        await navigator.mediaDevices.getDisplayMedia({video: {frameRate: 15}}).then(stream => {
            const screen = Twilio.Video.LocalVideoTrack(stream.getTracks()[0], {name:'screen'});
            participant.publishTrack(screen);
        }).catch(e => {
            console.log(e);
        });
    });
};

const handleTrackPublished = (trackPublication, participant) => {
    console.log("TRACK",trackPublication);
    console.log("PARTICIPANT",participant);
    function displayTrack(track) {
        // append this track to the participant's div and render it on the page
        const participantDiv = document.getElementById(participant.identity);
        // track.attach creates an HTMLVideoElement or HTMLAudioElement
        // (depending on the type of track) and adds the video or audio stream
        participantDiv.append(track.attach());
    }

    // check if the trackPublication contains a `track` attribute. If it does,
    // we are subscribed to this track. If not, we are not subscribed.
    if (trackPublication.track) {
        displayTrack(trackPublication.track);
    }

    // listen for any new subscriptions to this track publication
    trackPublication.on("subscribed", displayTrack);
};

const handleDisconnectedParticipant = (participant) => {
    // stop listening for this participant
    participant.removeAllListeners();
    // remove this participant's div from the page
    const participantDiv = document.getElementById(participant.identity);
    participantDiv.remove();
};

const joinRoom = async (roomName, token) => {
    // join the video room with the Access Token and the given room name
    return await Twilio.Video.connect(token, {
        room: roomName,
        audio: false,
        video: true
    });
};

form.addEventListener("submit", startRoom);