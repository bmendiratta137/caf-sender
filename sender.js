const applicationID = '02283EC0'; // Replace with your App ID
const namespace = 'urn:x-cast:com.example.custom';

let session = null;

// Initialize Cast API
window['__onGCastApiAvailable'] = function(isAvailable) {
    if (isAvailable) {
        initializeCastApi();
    }
};

function initializeCastApi() {
    const sessionRequest = new chrome.cast.SessionRequest(applicationID);
    const apiConfig = new chrome.cast.ApiConfig(sessionRequest, sessionListener, receiverListener);

    chrome.cast.initialize(apiConfig, onInitSuccess, onError);
}

function onInitSuccess() {
    console.log('Initialization succeeded');
}

function onError(message) {
    console.error('Error: ' + JSON.stringify(message));
}

function sessionListener(e) {
    session = e;
    console.log('Session established: ' + e.sessionId);
}

function receiverListener(e) {
    if (e === chrome.cast.ReceiverAvailability.AVAILABLE) {
        console.log('Receiver found');
    }
}

document.getElementById('castButton').addEventListener('click', function() {
    if (session) {
        session.sendMessage(namespace, {type: 'PLAY', media: 'https://path/to/media.mp4'}, onSuccess, onError);
    } else {
        chrome.cast.requestSession(function(e) {
            session = e;
            session.sendMessage(namespace, {type: 'PLAY', media: 'https://path/to/media.mp4'}, onSuccess, onError);
        }, onError);
    }
});

function onSuccess(message) {
    console.log('Success: ' + message);
}