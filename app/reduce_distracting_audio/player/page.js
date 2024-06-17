"use client"

import { useEffect, useRef, useState } from "react";

export default function Home() {

    const videoRef = useRef(null);
    const speechRef = useRef(null);
    const backgroundRef = useRef(null);

    const [timestamp, setTimestamp] = useState(0);
    const [toggleBackground, setToggleBackground] = useState(false);
    const [speechVolume, setSpeechVolume] = useState(1);
    const [backgroundVolume, setBackgroundVolume] = useState(1);
    const [muted, setMuted] = useState(true);

    const handleMuted = () => {
        setMuted(!muted);
    }

    useEffect(() => {
        const checkTime = () => {
            if (videoRef.current.currentTime !== timestamp) {
                setTimestamp(videoRef.current.currentTime);
                setToggleBackground(videoRef.current.spellcheck);
            }

            if(speechRef.current.volume !== speechVolume) {
                setSpeechVolume(speechRef.current.volume);
                console.log("speechVolume", speechVolume);
            }

            if(backgroundRef.current.volume !== backgroundVolume) {
                setBackgroundVolume(backgroundRef.current.volume);
                console.log("backgroundVolume", backgroundVolume);
            }
        };

        const interval = setInterval(checkTime, 100);

        return () => {
            clearInterval(interval);
        };
    }, [timestamp, speechVolume, backgroundVolume])

	return (
		<div className="bg-black py-4 h-screen text-white text-center grid m-auto">
			<div className="pt-4">
				<a href="/" className="m-auto px-5 py-3">Home 🏠</a>
				<a href="/reduce_distracting_audio/control" className="m-auto px-5 py-3 mx-3">Controls ⚙</a>
			</div>
            <video ref={videoRef} controls className="mx-auto w-3/5" muted>
                <source src="/BBC_Space/BBC_Space.mp4" type="video/mp4"/>
                <track
                    id="subtitles"
                    label="English"
                    kind="subtitles"
                    srcLang="en"
                    src="/BBC_Space/BBC_Space.vtt"/>
            </video>
            <audio id="speechAudio" ref={speechRef} volume={speechVolume} muted={muted}>
                <source src="/BBC_Space/BBC_Space_speech.mp3" type="audio/mpeg"/>
            </audio>
            <audio id="backgroundAudio" ref={backgroundRef} volume={backgroundVolume} muted={muted}>
                <source src="/BBC_Space/BBC_Space_background.mp3" type="audio/mpeg"/>
            </audio>
            <div>
                <button onClick={handleMuted}>Mute {muted ? "🔇" : "🔊"}</button>
            </div>
		</div>
	);
}
