"use client"

import { useEffect, useRef, useState } from 'react';
import Speech from "speak-tts";
import Captions from "/public/BBC_Space/BBC_Space_simplified.json";
import OriginalCaptions from "/public/BBC_Space/BBC_Space.json";

export default function Home() {
    const [timestamp, setTimestamp] = useState(0);
    const [textColor, setTextColor] = useState("text-white");
    const [duration, setDuration] = useState(0);
    const [caption, setCaption] = useState("");
    const [simplified, setSimplified] = useState(false);
    const [currentCaptionIndex, setCurrentCaptionIndex] = useState(0);
    const videoRef = useRef(null);

    const convertTime = (t) => {
        const text = t.split(":")
        return (parseInt(text[0], 10) * 60 * 60) + (parseInt(text[1], 10) * 60) + parseFloat(text[2])
    }

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
        window.socket.send(JSON.stringify({ type: 'seek', time: time }));
    };

    const handleSimplifyCaptions = () => {
        setSimplified(!simplified)
    }

    const handleBack = () => {
        if(currentCaptionIndex > 0) {
            const newTime = convertTime(Captions.captions[currentCaptionIndex - 1].start)
            setCurrentCaptionIndex(currentCaptionIndex - 1)
            setTimestamp(newTime)
            console.log(parseFloat(convertTime(Captions.captions[currentCaptionIndex].start, newTime)))
            videoRef.current.currentTime = newTime;
            videoRef.current.pause();
            window.socket.send(JSON.stringify({ type: 'seek', time: newTime }));
            window.socket.send(JSON.stringify({ type: 'pause' }));
        }
        
    }

    // If you want the reading out to be done by the control device speaker
    // const handleReadOut = () => {
    //     if (caption !== "") {
    //         videoRef.current.pause();
    //         window.socket.send(JSON.stringify({ type: 'pause' }));
    //         const speech = new Speech();

    //         speech.init({
    //             volume: 1.0,
    //             lang: "en-GB",
    //             rate: 1,
    //             pitch: 1
    //         }).then(data => {
    //             console.log("Speech is ready", data);
    //             speech.speak({
    //                 text: caption,
    //                 queue: false,
    //                 listeners: {
    //                     onend: () => {
    //                         videoRef.current.play();
    //                         window.socket.send(JSON.stringify({ type: 'play', time: videoRef.current.currentTime }));
    //                     }
    //                 }
    //             }).catch(e => {
    //                 console.error("Error:", e)
    //             })
    //         }).catch(e => {
    //             console.error("Error initialising speech:", e)
    //         })
    //     }
    // }

    // If you want the reading out to be done via the player device speaker
    // const handleReadOut = () => {
    //     if (caption !== "") {
    //         videoRef.current.pause();
    //         window.socket.send(JSON.stringify({ type: 'pause' }));
    //         window.socket.send(JSON.stringify({ type: 'readOut', readOut: true }));
    //     }
    // }

    const handleReadOut = (playerSpeaker) => {
        if (caption !== "") {
            if(playerSpeaker) {
                videoRef.current.pause();
                window.socket.send(JSON.stringify({ type: 'pause' }));
                window.socket.send(JSON.stringify({ type: 'readOut', readOut: true }));
            } else {
                videoRef.current.pause();
                window.socket.send(JSON.stringify({ type: 'pause' }));
                const speech = new Speech();
    
                speech.init({
                    volume: 1.0,
                    lang: "en-GB",
                    rate: 1,
                    pitch: 1
                }).then(data => {
                    console.log("Speech is ready", data);
                    speech.speak({
                        text: caption,
                        queue: false,
                        // listeners: {
                        //     onend: () => {
                        //         videoRef.current.play();
                        //         window.socket.send(JSON.stringify({ type: 'play', time: videoRef.current.currentTime }));
                        //     }
                        // }
                    }).catch(e => {
                        console.error("Error:", e)
                    })
                }).catch(e => {
                    console.error("Error initialising speech:", e)
                })
            }
        }
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
        if(simplified) {
            for (const element of Captions.captions) {
                if (parseFloat(convertTime(element.start)) < timestamp && parseFloat(convertTime(element.end)) >= timestamp) {
                    setCurrentCaptionIndex(Captions.captions.indexOf(element))
                    setCaption(element.text);
                    if (element.speaker === "presenter") {
                        setTextColor("text-white")
                    } else if (element.speaker === "speaker") {
                        setTextColor("text-yellow-300")
                    } else if (element.speaker === "interviewee") {
                        setTextColor("text-sky-500")
                    }
                    window.socket.send(JSON.stringify({ type: 'caption', caption: element.text, simplified: simplified, textColor: textColor }));
                }
            }
        } else {
            for (const element of OriginalCaptions.captions) {
                if (parseFloat(convertTime(element.start)) < timestamp && parseFloat(convertTime(element.end)) >= timestamp) {
                    setCurrentCaptionIndex(OriginalCaptions.captions.indexOf(element))
                    setCaption(element.text);
                    setTextColor("text-white");
                    window.socket.send(JSON.stringify({ type: 'caption', caption: element.text, simplified: simplified, textColor: textColor }));
                }
            }
        }
    }, [timestamp, simplified, textColor])

    return (
        <div className="bg-black py-4 h-screen text-white text-center grid grid-rows-4 auto-rows-max m-auto">
            <div className="pt-4">
                <a href="/" className="m-auto px-5 py-3">Home 🏠</a>
                <a href="/subtitle_simplification/player" className="m-auto px-5 py-3 mx-3">Player 📺</a>
            </div>
            <video ref={videoRef} controls muted className="mx-auto w-3/5 hidden">
                <source src="/BBC_Space/BBC_Space.mp4" type="video/mp4" />
                <track id="subtitles" label="English" kind="subtitles" srcLang="en" src="/BBC_Space/BBC_Space.vtt" />
            </video>
            <div className="mx-auto w-3/5 py-4 text-center row-span-2 flex flex-col">
                <div className="pb-6 align-end">
                    <button className="px-5 py-3" onClick={handleBack}>Go back ⬅</button>
                    <button className="px-5 py-3" onClick={handleSimplifyCaptions}>Simple Captions: {simplified ? "👍" : "👎"}</button>
                    {simplified && <button className="px-5 py-3" onClick={() => handleReadOut(true)}>Read out 🔊</button>} 
                </div>
            </div>
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