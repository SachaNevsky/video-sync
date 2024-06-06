'use client';

import { useCallback, useEffect, useRef, useState } from "react";

export default function Page() {
    const videoRef = useRef(null);
    // const videoRef = useCallback(node => {
    //     console.log(node)
    //     if(node !== null) {
    //         setCaptions(node.textContent)
    //     }
    // }, [])
    const [captions, setCaptions] = useState("");
    const [timestamp, setTimestamp] = useState(0);
    const [simplified, setSimplified] = useState(false);
    const [textColor, setTextColor] = useState("text-white");



    useEffect(() => {
        const checkTime = () => {
            if (videoRef.current.currentTime !== timestamp) {
                setTimestamp(videoRef.current.currentTime);
                setCaptions(videoRef.current.textContent.split("~")[0]);
                setSimplified(videoRef.current.textContent.split("~")[1]);
                setTextColor(videoRef.current.textContent.split("~")[2]);
                console.log(videoRef.current.textContent)
            }
        };

        const interval = setInterval(checkTime, 100);

        return () => {
            clearInterval(interval);
        };
    }, [timestamp]);

    return (
        <div className="bg-black py-4 h-screen text-white text-center grid m-auto grid-rows-8">
            <div className="pt-4">
                <a href="/" className="m-auto px-5 py-3">Home 🏠</a>
                <a href="/subtitle_simplification/control" className="m-auto px-5 py-3 mx-3">Controls ⚙</a>
            </div>
            <div className="mx-auto w-4/5 py-4 text-center flex flex-col row-span-5">
                <video ref={videoRef} controls muted>
                    <source src="/BBC_Space/BBC_Space.mp4" type="video/mp4" />
                    <track
                        id="subtitles"
                        label="Simplified"
                        kind="subtitles"
                        srcLang="en"
                        src="/BBC_Space/BBC_Space_simplified.vtt" />
                </video>
            </div>
            <div className="mx-auto w-4/5 py-4 text-center flex flex-col grid-start-7 row-span-2">
                {videoRef.current && simplified ? (
                        <div className={textColor + " max-w-[60ch] m-auto text-3xl font-medium"}>
                            {captions}
                        </div>
                    ) : (
                        <div className={"max-w-[51ch] m-auto text-3xl font-medium"}>
                            {captions}
                        </div>
                    )
                }
            </div>
        </div>
    );
}