export default function Home() {

	return (
		<div className="bg-black py-4 h-[96vh] text-white text-center grid grid-cols-1">
			<video controls muted className="mx-auto w-3/5">
				<source src="/BBC_Space/BBC_Space.mp4" type="video/mp4" />
				<track
					id="subtitles"
					label="English"
					kind="subtitles"
					srcLang="en"
					src="/BBC_Space/BBC_Space.vtt"/>
			</video>
		</div>
	);
}
