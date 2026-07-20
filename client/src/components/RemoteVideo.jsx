import { useEffect, useRef } from "react";

export default function RemoteVideo({ stream }){
    const videoRef = useRef(null);
    useEffect(() => {
        if(videoRef.current && stream){
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    return(
        <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{
                width: "300px",
                borderRadius: "12px"
            }}
        />
    )
}