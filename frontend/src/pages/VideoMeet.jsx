import { useState, useEffect, useRef } from 'react';
import styles from "../styles/videoComponent.module.css";
import httpStatus from "http-status";

export default function VideoMeet(){
    const [participants, setParticipants] = useState([]);
    const [isMicOn, setIsMicOn] = useState(true);
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [isChatOpen, setIsChatOpen] = useState(true);

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