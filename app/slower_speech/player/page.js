'use client';

import { useEffect, useRef, useState } from "react";
import Speech from "speak-tts";

export default function Page() {

    const videoRef = useRef(null);

    const [captions, setCaptions] = useState("");
    const [timestamp, setTimestamp] = useState(0);
    const [slowDown, setSlowDown] = useState(false);
    const [muted, setMuted] = useState(true);
    const [video, setVideo] = useState("bbc_space");

    const handleMuted = () => {
        setMuted(!muted);
    }

    const selectVideo = (newVideo) => {
        if (window.socket !== undefined && window.socket.readyState === socket.OPEN) {
            setVideo(newVideo);
            window.socket.send(JSON.stringify({ type: 'selectVideo', video: newVideo }));
        }
    }

    useEffect(() => {
        if (`/${video}/${video}.mp4` !== videoRef.current.src) {
            selectVideo(video);
            setCaptions("");
        }
    }, [video]);

    useEffect(() => {
        const handleReadOut = () => {
            if (videoRef.current.textContent !== "") {
                const speech = new Speech();

                const toRead = videoRef.current.textContent.split("~~")[0]
                const duration = parseFloat(videoRef.current.textContent.split("~~")[1])
                const ttsDuration = parseFloat(videoRef.current.textContent.split("~~")[2])

                window.socket.send(JSON.stringify({ type: 'playback', playback: duration/ttsDuration }));

                speech.init({
                    volume: 1.0,
                    lang: "en-GB",
                    rate: 1,
                    pitch: 1
                }).then(data => {
                    speech.speak({
                        text: toRead,
                        queue: false,
                        listeners: {
                            onend: (event) => {
                                videoRef.current.spellcheck = false;
                                window.socket.send(JSON.stringify({ type: 'playback', playback: 1 }));
                            }
                        }
                    }).catch(e => {
                        console.error("Error:", e)
                    })
                }).catch(e => {
                    console.error("Error initialising speech:", e)
                })
            }
        }

        const checkTime = () => {
            if (videoRef.current.currentTime !== timestamp) {
                setTimestamp(videoRef.current.currentTime);

                if(captions !== videoRef.current.textContent) {
                    setCaptions(videoRef.current.textContent);
                    if (videoRef.current.spellcheck) {
                        handleReadOut();
                    }
                }
                setSlowDown(videoRef.current.spellcheck);
            }
        };

        const interval = setInterval(checkTime, 100);

        return () => {
            clearInterval(interval);
        };
    }, [timestamp, captions]);


    return (
        <div className="bg-black py-4 h-screen text-white text-center grid m-auto grid-rows-11">
            <div className="pt-4">
                <a href="/" className="m-auto px-5 py-3">Home 🏠</a>
                <a href="/slower_speech/control" className="m-auto px-5 py-3 mx-3">Controls ⚙</a>
            </div>
            <div className="mx-auto w-3/5 py-4">
                <button onClick={() => selectVideo("bbc_space")}>
                    BBC News
                </button>
                <button onClick={() => selectVideo("university_challenge")}>
                    Quiz Show
                </button>
            </div>
            <video ref={videoRef} controls muted={muted} className="mx-auto w-3/5 row-span-7 py-4" src={`/${video}/${video}.mp4`} type="video/mp4">
                <track id="subtitles" label="English" kind="subtitles" srcLang="en" src={`/${video}/${video}.vtt`} />
            </video>
            <div className="mx-auto w-3/5 py-4 text-center grid-start-11">
                <button onClick={handleMuted}>Mute {muted ? "🔇" : "🔊"}</button>
            </div>
        </div>
    );
}