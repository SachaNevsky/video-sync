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


    useEffect(() => {
        const checkTime = () => {
            if (videoRef.current.currentTime !== timestamp) {
                setTimestamp(videoRef.current.currentTime);
                setCaptions(videoRef.current.textContent);
            }
        };

        const interval = setInterval(checkTime, 100);

        return () => {
            clearInterval(interval);
        };
    }, [timestamp]);

    return (
        <div className="bg-black py-4 h-screen text-white text-center grid m-auto">
            <div className="pt-4">
                <a href="/" className="m-auto px-5 py-3">Home 🏠</a>
                <a href="/subtitle_simplification/control" className="m-auto px-5 py-3 mx-3">Controls ⚙</a>
            </div>
            <video ref={videoRef} controls muted className="mx-auto w-3/5">
                <source src="/BBC_Space/BBC_Space.mp4" type="video/mp4" />
                <track
                    id="subtitles"
                    label="Simplified"
                    kind="subtitles"
                    srcLang="en"
                    src="/BBC_Space/BBC_Space_simplified.vtt" />
            </video>
            {videoRef.current && <div className={"text-white max-w-[60ch] m-auto text-4xl font-medium"}>
                {captions}
            </div>}
        </div>
    );
}