"use client"

import { useEffect, useRef, useState } from 'react';
import Captions from "/public/BBC_Space/BBC_Space.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faHome, faVideo } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
    const [timestamp, setTimestamp] = useState(0);
	const [duration, setDuration] = useState(0);
    const [caption, setCaption] = useState("");
    const [slowMode, setSlowMode] = useState(false);
    const [playback, setPlayback] = useState(1);
    const [magnitude, setMagnitude] = useState(0.03);
	const videoRef = useRef(null);

	const handlePlay = () => {
		videoRef.current.play();
		window.socket.send(JSON.stringify({ type: 'play', time: videoRef.current.currentTime }));
	};

	const handlePause = () => {
		videoRef.current.pause();
		window.socket.send(JSON.stringify({ type: 'pause' }));
	};

	const handleSeek = (event) => {
		const time = parseFloat(event.target.value);
		videoRef.current.currentTime = time;
		setTimestamp(videoRef.current.currentTime);
		window.socket.send(JSON.stringify({ type: 'seek', time }));
	};

    const handleSlowMode = () => {
        setSlowMode(!slowMode)
    }

    const handleMagnitude = (event) => {
        setMagnitude(event.target.value)
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

    useEffect(() => {
        const convertTime = (t) => {
            const text = t.split(":")
            return (parseInt(text[0], 10) * 60 * 60) + (parseInt(text[1], 10) * 60) + parseFloat(text[2])
        }
        
        for(const element of Captions.captions) {
            if(parseFloat(convertTime(element.start)) < timestamp && parseFloat(convertTime(element.end)) >= timestamp) {
                setCaption(element.text)
                if(slowMode && parseInt(element.flesch_kincaid) >= 8) {
                    const reduce = Math.min((element.flesch_kincaid - 7) * magnitude, 11 * magnitude);
                    setPlayback(1 - reduce);
                    console.log("Slowed:", element.flesch_kincaid, playback)
                    videoRef.current.playbackRate = playback;
                    window.socket.send(JSON.stringify({type: "playback", playback}))
                } else {
                    setPlayback(1);
                    console.log("Standard:", element.flesch_kincaid, playback)
                    window.socket.send(JSON.stringify({type: "playback", playback}))
                }
            }
        }
    }, [timestamp, slowMode, magnitude, playback])

    return (
		<div className="bg-black py-4 h-screen text-white text-center grid grid-rows-3 auto-rows-max m-auto">
            <div className="pt-4">
				<a href="/" className="m-auto px-5 py-3 mx-3">Home 🏠</a>
                <a href="/slower_subtitles/player" className="m-auto px-5 py-3">Player 📺</a>
			</div>
			<video ref={videoRef} controls muted className="mx-auto w-3/5 hidden">
				<source src="/BBC_Space/BBC_Space.mp4" type="video/mp4" />
				<track id="subtitles" label="English" kind="subtitles" srcLang="en" src="/BBC_Space/BBC_Space.vtt"/>
			</video>
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
                        {Math.floor(timestamp/60)}:{('0'+parseInt(timestamp-Math.floor(timestamp/60) * 60)).slice(-2)} / {Math.floor(duration/60)}:{('0'+parseInt(duration-Math.floor(duration/60) * 60)).slice(-2)}
                    </div>
                </div>
            </div>
            <div className="mx-auto w-3/5 py-4">
                <div className="pb-6">
                    <button className="px-5 py-3" onClick={handleSlowMode}>Slow Mode: {slowMode ? "👍" : "👎"}</button>
                </div>
                {slowMode && 
                    <div style={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                        <label for="magnitude" className="px-4">Weak </label>
                        <input
                            name="magnitude"
                            className="w-3/5"
                            type="range"
                            min={0.01}
                            max={0.05}
                            step={0.005}
                            onChange={handleMagnitude}
                        />
                        <label for="magnitude" className="px-4"> Strong</label>
                    </div>
                }
            </div>
		</div>
	);
}