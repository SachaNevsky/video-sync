'use client';

import { useRef, useState, useEffect } from 'react';

export default function Page() {

    const [duration, setDuration] = useState(0);
    const [timestamp, setTimestamp] = useState(0);
    const [toggleBackground, setToggleBackground] = useState(false);
    const [speechVolume, setSpeechVolume] = useState(100);
    const [backgroundVolume, setBackgroundVolume] = useState(50);
    const [video, setVideo] = useState("bbc_space");

    const videoRef = useRef(null);
    const speechRef = useRef(null);
    const backgroundRef = useRef(null);

    const handlePlay = () => {
        window.socket.send(JSON.stringify({ type: 'playAll', time: videoRef.current.currentTime }));
    };

    const handlePause = () => {
        window.socket.send(JSON.stringify({ type: 'pauseAll', time: videoRef.current.currentTime }));
    };

    const handleBack = () => {
        const time = videoRef.current.currentTime - 10;
        window.socket.send(JSON.stringify({ type: 'back10', time: time }));
    }

    const handleSeek = (event) => {
        const time = parseFloat(event);
        window.socket.send(JSON.stringify({ type: 'seekAll', time: time }));
    };

    const handleSpeechVolume = (event) => {
        setSpeechVolume(event);
        window.socket.send(JSON.stringify({ type: 'handleSpeechVolume', speechVolume: event }));
    }

    const handleBackgroundVolume = (event) => {
        setBackgroundVolume(event);
        window.socket.send(JSON.stringify({ type: 'handleBackgroundVolume', backgroundVolume: event }));
    }

    const handleToggleBackground = () => {
        setToggleBackground(!toggleBackground);
        window.socket.send(JSON.stringify({ type: 'toggleBackground', toggleBackground: toggleBackground, speechVolume: speechVolume, backgroundVolume: backgroundVolume }));
    }

    useEffect(() => {
        if (videoRef.current.duration) {
            setDuration(videoRef.current.duration);
        }

        const checkTime = () => {
            if (videoRef.current.currentTime !== timestamp) {
                setTimestamp(videoRef.current.currentTime);
            }

            if (`http://localhost:3000/${video}/${video}.mp4` !== videoRef.current.src) {
                if (videoRef.current.duration) {
                    setDuration(videoRef.current.duration);
                }
                setVideo(videoRef.current.src.split("/").at(-1).replace(".mp4", ""));
            }
        };

        const interval = setInterval(checkTime, 10);

        return () => {
            clearInterval(interval);
        };
    }, [timestamp, video]);

    return (
        <div className="bg-black py-4 h-screen text-white text-center grid m-auto grid-rows-4">
            <div className="pt-4">
                <a href="/" className="m-auto px-5 py-3">Home 🏠</a>
                <a href="/reduce_distracting_audio/player" className="m-auto px-5 py-3 mx-3">Player 📺</a>
            </div>
            <video id="videoController" ref={videoRef} controls muted className="mx-auto w-3/5 hidden" src={`/${video}/${video}.mp4`} type="video/mp4">
                <track id="subtitles" label="English" kind="subtitles" srcLang="en" src={`/${video}/${video}.vtt`} />
            </video>
            <audio id="speechAudio" src={`/${video}/${video}_speech.mp3`} type="audio/mpeg" ref={speechRef} muted/>
            <audio id="backgroundAudio" src={`/${video}/${video}_background.mp3`} type="audio/mpeg" ref={backgroundRef} muted/>
            <div>
                <button onClick={handleToggleBackground}>Reduce Background Noise {toggleBackground ? "👍" : "👎"}</button>
            </div>
            {toggleBackground && <div className="grid grid-rows-2 grid-cols-1 gap-4">
                <div>
                    <label>Speech Volume: </label>
                    <input type="range" id="SpeechSlider" name="Speechs" min="0" max="100" value={speechVolume} onChange={(e) => handleSpeechVolume(e.target.value)} /> {speechVolume}%
                </div>
                <div>
                    <label className="col-start-4">Background Volume: </label>
                    <input type="range" id="backgroundSlider" name="Background" min="0" max="100" value={backgroundVolume} onChange={(e) => handleBackgroundVolume(e.target.value)} /> {backgroundVolume}%
                </div>
            </div>}
            <div className="mx-auto w-3/5 py-4">
                <div className="pb-6">
                    <button className="px-5 py-3" onClick={handleBack}>⬅ Back</button>
                    <button className="px-5 py-3" onClick={handlePlay}>Play ▶</button>
                    <button className="px-5 py-3" onClick={handlePause}>Pause ⏸</button>
                </div>
                <div>
                    <input
                        className="mx-auto w-3/5"
                        type="range"
                        min={0}
                        max={duration}
                        value={timestamp}
                        onChange={(e) => handleSeek(e.target.value)}
                    />
                    <div>
                        {Math.floor(timestamp / 60)}:{('0' + parseInt(timestamp - Math.floor(timestamp / 60) * 60)).slice(-2)} / {Math.floor(duration / 60)}:{('0' + parseInt(duration - Math.floor(duration / 60) * 60)).slice(-2)}
                    </div>
                </div>
            </div>
        </div>
    );
}