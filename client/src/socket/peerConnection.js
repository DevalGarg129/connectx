const configuration = {
    iceServers: [{
        urls: "stun:stun.l.google.com:19302",
    },],
};

export const createPeerConnection = () => {
    return new RTCPeerConnection(configuration);
};
//not to store peerConnection is react state because RTCPeerConnection is mutable and shouldnt trigger re-renders.  
export default createPeerConnection;