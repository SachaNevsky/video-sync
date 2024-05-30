"use client"

import { useEffect } from 'react';
import './globals.css';

export default function RootLayout({ children }) {
	useEffect(() => {
		if (typeof window !== 'undefined') {
			const socket = new WebSocket('ws://10.105.2.77:8080');

			socket.onopen = () => {
				console.log('Connected to WebSocket server');
			};

			socket.onmessage = (event) => {
				const data = JSON.parse(event.data);
				const video = document.querySelector('video');
				if (data.type === "play") {
					video.currentTime = data.time;
					video.play();
				} else if (data.type === "pause") {
					video.pause();
				} else if (data.type === 'seek') {
					video.currentTime = video.duration / 100 * data.time;
				}
			};

			window.socket = socket;
		}
	}, []);

	return (
		<html lang="en" suppressHydrationWarning>
			<body>{children}</body>
		</html>
	);
}
