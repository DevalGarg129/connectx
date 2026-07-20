//Required Modules
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from "react-router-dom";

//Imported Files
import socket from '../socket/socket';
import { SOCKET_EVENTS } from '../socket/socketEvents';
import createPeerConnection from '../socket/peerConnection';
import RemoteVideo from '../components/RemoteVideo';

//styles
import styles from "../styles/videoComponent.module.css";

//Main video meet function
export default function VideoMeet(){
    //States
    const [participants, setParticipants] = useState([]);
    const [isMicOn, setIsMicOn] = useState(true);
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [isChatOpen, setIsChatOpen] = useState(true);
    const [remoteStreams, setRemoteStreams] = useState([]);

    const { roomId } = useParams();
    const localVideoRef = useRef(null);
    const localStreamRef = useRef(null);
    const peerConnectionsRef = useRef({});

    const user = {
        id: "123",
        username: "Deval"
    };

    //function for starting the local Stream
    const startLocalStream = async () => {
        try{
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
            localStreamRef.current = stream;
            if(localVideoRef.current){
                localVideoRef.current.srcObject = stream;
            }
        }catch(error){
            console.error(`Failed to connect : ${error}`);
        }
    };

    //Function for creating Peer
    const createPeer = (socketId) => {
        if(peerConnectionsRef.current[socketId]){
            return peerConnectionsRef.current[socketId];
        }
        const pc = createPeerConnection();
        peerConnectionsRef.current[socketId] = pc;
        localStreamRef.current?.getTracks().forEach(track => {
            pc.addTrack(track, localStreamRef.current);
        });
        console.log("Peer Created : ", socketId);

        //Peer Events
        pc.onicecandidate = (event) => {
            if(!event.candidate) return;
            
            socket.emit(SOCKET_EVENTS.ICE_CANDIDATE, {
                targetSocketId: socketId,
                candidate: event.candidate
            });
            console.log("ICE Candidate Generated");
        };

        pc.ontrack = (event) => {
            const remoteStream = event.streams[0];
            setRemoteStreams((prev) => {
                const exists = prev.find(
                    stream => stream.socketId === socketId
                );

                if(exists){
                    return prev.map(stream => 
                        stream.socketId === socketId ?{
                            ...stream,
                            stream: remoteStream
                        } : stream
                    );
                }

                return [
                    ...prev,
                    {
                        socketId,
                        stream: remoteStream
                    }
                ];
            });

            console.log("Remote Track Received", socketId);
        };

        pc.onconnectionstatechange = () => {
            console.log(pc.connectionState);
        };

        return pc;
    };

    useEffect(() => {
        startLocalStream();
        return () => {
            if(localStreamRef.current){
                localStreamRef.current
                    .getTracks()
                    .forEach(track => track.stop());
            }
        };
    }, []);

    //Use Effect for the Socket Events
    useEffect(() => {
        socket.connect();

        socket.emit(SOCKET_EVENTS.JOIN_ROOM, {
            roomId,
            userId:user.id,
            username:user.username
        });

        const handleUsers = (users) => {
            setParticipants(users);
            users.forEach((user) => {
                if(user.socketId !== socket.id){
                    createPeer(user.socketId);
                }
            });
            console.log("Participants : ", users);
        };

        const handleJoined = async (user) => {
            setParticipants(prev => [...prev, user]);
            createPeer(user.socketId);
            await createOffer(user.socketId);
        };

        const handleLeft = ({ socketId }) => {
            peerConnectionsRef.current[socketId]?.close();
            delete peerConnectionsRef.current[socketId];
            setParticipants(prev => 
                prev.filter(user => user.socketId !== socketId)
            );

            setRemoteStreams(prev => 
                prev.filter(stream => stream.socketId !== socketId)
            )
        };

        const createOffer = async ( targetSocketId ) => {
            try{
                const pc = peerConnectionsRef.current[targetSocketId];
                if(!pc){
                    console.error("Peer Connection Not Found");
                    return;
                }
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);
                socket.emit(SOCKET_EVENTS.OFFER, {
                    targetSocketId,
                    offer
                });
                console.log("Offer Sent to : ", targetSocketId);
            }catch(error){
                console.error("Error : ", error.message);
            }
        };

        const createAnswer = async (targetSocketId, offer) => {
            try{
                let pc = peerConnectionsRef.current[targetSocketId];
                if(!pc){
                    pc = createPeer(targetSocketId);
                }

                await pc.setRemoteDescription(
                    new RTCSessionDescription(offer)
                );

                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                socket.emit(SOCKET_EVENTS.ANSWER, {
                    targetSocketId,
                    answer
                });
                console.log("Answer sent : ", targetSocketId);
            }catch(error){
                console.error('Create Answer Error : ', error);
            }
        };

        const handleOffer = async (data) => {
            try{
                const { offer, from, userId, username } = data;
                console.log("Offer Received From : ", username);
                let pc = peerConnectionsRef.current[from];

                if(!pc){
                    pc = createPeer(from);
                }

                await pc.setRemoteDescription(
                    new RTCSessionDescription(offer)
                );
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                socket.emit(SOCKET_EVENTS.ANSWER, {
                    targetSocketId: from,
                    answer
                });

                console.log("Answer Sent");
            }catch(error){
                console.error(error);
            }
        };

        const handleAnswer = async (data) => {
            try{
                const { answer, from } = data;
                console.log("Answered Received");

                const pc = peerConnectionsRef.current[from];
                if(!pc){
                    console.error("Peer not found");
                    return;
                }
                await pc.setRemoteDescription(new RTCSctpTransport(answer));
                console.log("Answer connected");
            }catch(error){
                console.error(error);
            }
        }

        const handleIceCandidate = async (data) => {
            try{
                const {candidate, from} = data;
                const pc = peerConnectionsRef.current[from];

                if(!pc){
                    console.log("Peer not found");
                    return;
                }
                await pc.addIceCandidate(
                    new RTCIceCandidate(candidate)
                );
                console.log("Ice Candidate Added");
            }catch(error){
                console.error("Error : ", error);
            }
        };

        const cleanupMeeting =  () => {
            if(localStreamRef.current){
                localStreamRef.current
                    .getTracks()
                    .forEach(track => track.stop());
            }

            Objects.values(peerConnectionsRef.current)
                .forEach(pc => pc.close());

            peerConnectionsRef.current = {};
            socket.disconnect();
        };

        //sockets handling for events
        socket.on(SOCKET_EVENTS.ROOM_USERS, handleUsers);
        socket.on(SOCKET_EVENTS.USER_JOINED, handleJoined);
        socket.on(SOCKET_EVENTS.USER_LEFT, handleLeft);
        socket.on(SOCKET_EVENTS.OFFER, handleOffer);
        socket.on(SOCKET_EVENTS.ANSWER, handleAnswer);
        socket.on(SOCKET_EVENTS.ICE_CANDIDATE, handleIceCandidate);

        return () => {
            socket.emit(SOCKET_EVENTS.LEAVE_ROOM);

            socket.off(SOCKET_EVENTS.ROOM_USERS, handleUsers);
            socket.off(SOCKET_EVENTS.USERS_JOINED, handleJoined);
            socket.off(SOCKET_EVENTS.USERS_LEFT, handleLeft);
            socket.off(SOCKET_EVENTS.OFFER, handleOffer);
            socket.off(SOCKET_EVENTS.ANSWER, handleAnswer);
            socket.off(SOCKET_EVENTS.ICE_CANDIDATE, handleIceCandidate);

            Object.values(peerConnectionsRef.current)
                .forEach(pc => pc.close());

            peerConnectionsRef.current = {};
            cleanupMeeting();
            socket.disconnect();
        };
    }, []);

    const leaveMeeting = () => {
        try{
            console.log("Leaving the Meeting....");

            //stop local media
            if(localStreamRef.current){
                localStreamRef.current
                    .getTracks()
                    .forEach(track => track.stop());
            }

            //close peer connnection
            Object.values(peerConnectionsRef.current)
                .forEach(pc => pc.close());

            peerConnectionsRef.current = {};

            //clear participants;
            setParticipants([]);

            //clear remote streams
            setRemoteStreams([]);

            socket.emit(SOCKET_EVENTS.LEAVE_ROOM);
            cleanupMeeting();
            socket.disconnect();
            navigate("/");
        }catch(error){
            console.log("Error : ", message);
        }
    };

    const toggleMicrophone = () => {
        if(!localStreamRef.current) return;

        const audioTrack = localStreamRef.current.getAudioTracks()[0];
        if(!audioTrack) return;
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
    };

    const toggleCamera = () => {
        if(!localStreamRef.current) return;
        
        const videoTrack = localStreamRef.current.getVideoTracks()[0];
        if(!videoTrack) return;
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOn(videoTrack.enabled);
    };

    const toggleChat = () => {
        if(!localStreamRef.current) return;

        const chatTrack = localStreamRef.current.getChatTracks()[0];
        if(!chatTrack) return;
        chatTrack.enabled = !chatTrack.enabled;
        setIsChatOpen(chatTrack.enabled);
    };

    return (
        <div className={styles.meetingContainer}>
            <header className={styles.header}>
                <h2>ConnectX</h2>
                <span>Meeting</span>
            </header>

            <main className={styles.videoGrid}>
                {participants.length === 0 ? (
                    <div className={styles.emptyMeeting}>
                        Waiting for the Participants.....
                    </div>
                ) : (
                    participants.map((participant) => (
                        <div
                            key={participant.socketId}
                            className={styles.participantCard}
                        >
                            {participant.username}
                        </div>
                    ))
                )};
            </main>

            <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className={styles.localVideo}
            />

            <footer className={styles.toolbar}>
                <button onClick={toggleMicrophone}>
                    {isMicOn ? "Mic On" : "Mic Off"}
                </button>
                <button onClick={toggleCamera}>
                    {isCameraOn ? "Camera On" : "Camera Off"}
                </button>
                <button onClick={toggleChat}>
                    {isChatOpen ? "Chat is Open" : "Chat is Off"}
                </button>
                <button onClick={leaveMeeting}>
                    Leave
                </button>
            </footer>
        </div>
    )
}