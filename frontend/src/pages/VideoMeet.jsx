//Required Modules
import { useState, useEffect, useRef } from 'react';
import { useParams } from "react-router-dom";
import httpStatus from "http-status";

//Imported Files
import socket from '../socket/socket';
import { SOCKET_EVENTS } from '../socket/socketEvents';

//styles
import styles from "../styles/videoComponent.module.css";

//Main video meet function
export default function VideoMeet(){
    //States
    const [participants, setParticipants] = useState([]);
    const [isMicOn, setIsMicOn] = useState(true);
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [isChatOpen, setIsChatOpen] = useState(true);

    const roomId = useParams();

    //function for starting the local Stream
    const startLocalStream = async () => {
        try{
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
            localStreamRef.current = stream;
            if(localStreamRef.current){
                localStreamRef.current.srcObject = stream;
            }
        }catch(error){
            console.error(`Failed to connect : ${error}`);
            return res.status(500).json({
                message: error.message
            })
        }
    };

    useEffect(() => {
        startLocalStream();
        return () => {
            if(localStreamRef.current){
                localStreamRef.current.getTracks().forEach(track => track.stop());
            }
        };
        socket.connect();
    }, []);

    //Use Effect for the Socket Events
    useEffect(() => {
        socket.connect();

        socket.emit(SOCKET_EVENTS.JOIN_ROOM, {
            roomId,
            userId:user.id,
            username:user.username
        });

        const handleUsers = (users) => {};
        const handleJoined = (user) => {};
        const handleLeft = ({socketId}) => {};

        //sockets handling for events
        socket.on(SOCKET_EVENTS.ROOM_USERS, handleUsers);
        socket.on(SOCKET_EVENTS.JOIN_ROOM, handleJoined);
        socket.on(SOCKET_EVENTS.LEAVE_ROOM, handleLeft);

        return () => {
            socket.emit(SOCKET_EVENTS, LEAVE_ROOM);

            socket.off(SOCKET_EVENTS, ROOM_USERS, handleUsers);
            socket.off(SOCKET_EVENTS, USERS_JOINED, handleJoined);
            socket.off(SOCKET_EVENTS, USERS_LEFT, handleLeft);
        };
    }, []);
    return (
        <div className={styles.meetingContainer}>
            <header>
                <h2>ConnectX</h2>
                <span>Meeting</span>
            </header>

            <main className={styles.videoGrid}>
                <div className={styles.emptyMeeting}>
                    Waiting for the Participants
                </div>
            </main>

            <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className={styles.localVideo}
            />

            <footer className={styles.toolbar}>
                <button>Mic</button>
                <button>Camera</button>
                <button>Chat</button>
                <button>Leave</button>
            </footer>
        </div>
    )
}