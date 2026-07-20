//Required Modules
import { useState, useEffect, useRef } from 'react';
import { useParams } from "react-router-dom";

//Imported Files
import socket from '../socket/socket';
import { SOCKET_EVENTS } from '../socket/socketEvents';
import createPeerConnection from '../socket/peerConnection';

//styles
import styles from "../styles/videoComponent.module.css";

//Main video meet function
export default function VideoMeet(){
    //States
    const [participants, setParticipants] = useState([]);
    const [isMicOn, setIsMicOn] = useState(true);
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [isChatOpen, setIsChatOpen] = useState(true);

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

        const handleJoined = (user) => {
            setParticipants(prev => [...prev, user]);
            createPeer(user.socketId);
        };

        const handleLeft = ({ socketId }) => {
            peerConnectionsRef.current[socketId]?.close();
            delete peerConnectionsRef.current[socketId];
            setParticipants(prev => 
                prev.filter(user => user.socketId !== socketId)
            );
        };

        //sockets handling for events
        socket.on(SOCKET_EVENTS.ROOM_USERS, handleUsers);
        socket.on(SOCKET_EVENTS.USER_JOINED, handleJoined);
        socket.on(SOCKET_EVENTS.USER_LEFT, handleLeft);

        return () => {
            socket.emit(SOCKET_EVENTS.LEAVE_ROOM);

            socket.off(SOCKET_EVENTS.ROOM_USERS, handleUsers);
            socket.off(SOCKET_EVENTS.USERS_JOINED, handleJoined);
            socket.off(SOCKET_EVENTS.USERS_LEFT, handleLeft);

            Object.values(peerConnectionRef.current)
                .forEach(pc => pc.close());

            peerConnectionsRef.current = {};
            socket.disconnect();
        };
    }, []);

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
                <button>
                    {isMicOn ? "Mic On" : "Mic Off"}
                </button>
                <button>
                    {isCameraOn ? "Camera On" : "Camera Off"}
                </button>
                <button>
                    {isChatOpen ? "Chat is Open" : "Chat is Off"}
                </button>
                <button>Leave</button>
            </footer>
        </div>
    )
}