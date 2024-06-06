"use client"

import { useEffect } from 'react';
import './globals.css';

export default function RootLayout({ children }) {
	useEffect(() => {
		if (typeof window !== 'undefined') {
			const socket = new WebSocket('ws://192.168.1.87:8080');

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
					video.currentTime = data.time;
				} else if (data.type === 'playback') {
					video.playbackRate = data.playback;
				} else if (data.type === "caption") {
					video.textContent = `${data.caption}~~${data.simplified}~~${data.textColor}`;
				} else if (data.type === "readOut") {
					video.spellcheck = data.readOut;
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
