'use client';

import { useRef, useState, useEffect } from 'react';

export default function Page() {

    const [duration, setDuration] = useState(0);
    const [timestamp, setTimestamp] = useState(0);
    const [toggleBackground, setToggleBackground] = useState(false);
    const [speechVolume, setSpeechVolume] = useState(100);
    const [backgroundVolume, setBackgroundVolume] = useState(50);
    const videoRef = useRef(null);
    const speechRef = useRef(null);
    const backgroundRef = useRef(null);

    const handlePlay = () => {
        videoRef.current.play();
        speechRef.current.play();
        backgroundRef.current.play()
        window.socket.send(JSON.stringify({ type: 'playAll', time: videoRef.current.currentTime }));
    };

    const handlePause = () => {
        videoRef.current.pause();
        speechRef.current.pause();
        backgroundRef.current.pause()
        window.socket.send(JSON.stringify({ type: 'pauseAll' }));
    };

    const handleSeek = (event) => {
        const time = parseFloat(event.target.value);
        videoRef.current.currentTime = time;
        setTimestamp(videoRef.current.currentTime);
        window.socket.send(JSON.stringify({ type: 'seekAll', time: time }));
    };

    const handleSpeechVolume = (e) => {
        setSpeechVolume(e);
        window.socket.send(JSON.stringify({ type: 'handleSpeechVolume', speechVolume: e }));
    }

    const handleBackgroundVolume = (e) => {
        setBackgroundVolume(e);
        window.socket.send(JSON.stringify({ type: 'handleBackgroundVolume', backgroundVolume: e }));
    }

    const handleToggleBackground = () => {
        setToggleBackground(!toggleBackground);
        window.socket.send(JSON.stringify({ type: 'toggleBackground', toggleBackground: toggleBackground }));
    }

    useEffect(() => {
        setDuration(videoRef.current.duration);

        const checkTime = () => {
            if (videoRef.current.currentTime !== timestamp) {
                setTimestamp(videoRef.current.currentTime);
            }
        };

        const interval = setInterval(checkTime, 100);

        return () => {
            clearInterval(interval);
        };
    }, [timestamp]);

    return (
        <div className="bg-black py-4 h-screen text-white text-center grid m-auto grid-rows-4">
            <div className="pt-4">
                <a href="/" className="m-auto px-5 py-3">Home 🏠</a>
                <a href="/reduce_distracting_audio/player" className="m-auto px-5 py-3 mx-3">Player 📺</a>
            </div>
            <video ref={videoRef} controls muted className="mx-auto w-3/5 hidden">
                <source src="/BBC_Space/BBC_Space.mp4" type="video/mp4" />
                <track id="subtitles" label="English" kind="subtitles" srcLang="en" src="/BBC_Space/BBC_Space.vtt" />
            </video>
            <audio id="speechAudio" src="/BBC_Space/BBC_Space_speech.mp3" type="audio/mpeg" ref={speechRef} muted></audio>
            <audio id="backgroundAudio" src="/BBC_Space/BBC_Space_background.mp3" type="audio/mpeg" ref={backgroundRef} muted></audio>
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
                    <button className="px-5 py-3" onClick={handlePlay}>Play ▶</button>
                    <button className="px-5 py-3" onClick={handlePause}>Pause ⏸</button>
                </div>
                <div>
                    <input
                        className="mx-auto w-3/5"
                        type="range"
                        min={0}
                        max={duration}
                        step={0.1}
                        value={timestamp}
                        onChange={handleSeek}
                    />
                    <div>
                        {Math.floor(timestamp / 60)}:{('0' + parseInt(timestamp - Math.floor(timestamp / 60) * 60)).slice(-2)} / {Math.floor(duration / 60)}:{('0' + parseInt(duration - Math.floor(duration / 60) * 60)).slice(-2)}
                    </div>
                </div>
            </div>
        </div>
    );
}