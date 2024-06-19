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
				const speechAudioRef = document.querySelector("#speechAudio");
				const backgroundAudioRef = document.querySelector("#backgroundAudio");
				
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
				} else if (data.type === "toggleBackground") {
					video.spellcheck = data.toggleBackground;
				} else if (data.type === "handleSpeechVolume") {
					speechAudioRef.volume = parseFloat(data.speechVolume) / 100;
				} else if (data.type === "handleBackgroundVolume") {
					backgroundAudioRef.volume = parseFloat(data.backgroundVolume) / 100;
				} else if (data.type === "playAll") {
					video.play();
					speechAudioRef.play();
					backgroundAudioRef.play();
				} else if (data.type === "pauseAll") {
					video.pause();
					speechAudioRef.pause();
					backgroundAudioRef.pause();
				} else if (data.type === "seekAll") {
					video.currentTime = data.time;
					speechAudioRef.currentTime = data.time;
					backgroundAudioRef.currentTime = data.time;
				} else if (data.type === "selectVideo") {
					video.src = `/${data.video}/${data.video}.mp4`;
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
