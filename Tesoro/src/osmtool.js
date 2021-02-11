// WORK IN PROGRESS

const configuration = { };
const peerConnection = new RTCPeerConnection(configuration);
const dataChannel = peerConnection.createDataChannel();

peerConnection.addEventListener('datachannel', event => {
    const dataChannel = event.channel;
});

// Enable textarea and button when opened
dataChannel.addEventListener('open', event => {
});

// Disable input when closed
dataChannel.addEventListener('close', event => {
});

const message = "Hello, World!";
dataChannel.send(message);

// Append new messages to the box of incoming messages
dataChannel.addEventListener('message', event => {
    const message = event.data;
    console.log(message);
});
