"use client"

import { useRef } from 'react';

export default function Home() {
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
		videoRef.current.currentTime = videoRef.current.duration / 100 * time;
		window.socket.send(JSON.stringify({ type: 'seek', time }));
	};

	return (
		<div>
			<video ref={videoRef} width="600" controls muted>
				<source src="/video.mp4" type="video/mp4" />
			</video>
			<div>
				<button onClick={handlePlay}>Play</button>
				<button onClick={handlePause}>Pause</button>
				<input
					type="range"
					min="0"
					max="100"
					step="0.1"
					onChange={handleSeek}
				/>
			</div>
		</div>
	);
}
