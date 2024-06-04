export default function Home() {

	const buttonStyle = "border m-auto p-5 hover:bg-orange-400 "

	return (
		<div className="bg-black py-4 h-screen text-white text-center grid grid-cols-6 grid-rows-4 gap-2 p-4">
			<a href="/subtitle_simplification/player" className={buttonStyle + "col-start-1 row-start-2"}>
				Subtitle Simplification (Player)
			</a>
			<a href="/subtitle_simplification/control" className={buttonStyle + "col-start-1 row-start-3"}>
				Subtitle Simplification (Control)
			</a>

			<a href="/slower_subtitles/player" className={buttonStyle + "col-start-2 row-start-2"}>
				Slower Subtitles (Player)
			</a>
			<a href="/slower_subtitles/control" className={buttonStyle + "col-start-2 row-start-3"}>
				Slower Subtitles (Control)
			</a>

			<a href="/context_aware_rewind/player" className={buttonStyle + "col-start-3 row-start-2"}>
				Context Aware Rewind (Player)
			</a>
			<a href="/context_aware_rewind/control" className={buttonStyle + "col-start-3 row-start-3"}>
			Context Aware Rewind (Control)
			</a>

			<a href="/reduce_distracting_audio/player" className={buttonStyle + "col-start-4 row-start-2"}>
				Reduce Distracting Audio (Player)
			</a>
			<a href="/reduce_distracting_audio/control" className={buttonStyle + "col-start-4 row-start-3"}>
				Reduce Distracting Audio (Control)
			</a>

			<a href="/reduce_distracting_visuals/player" className={buttonStyle + "col-start-5 row-start-2"}>
				Reduce Distracting Visuals (Player)
			</a>
			<a href="/reduce_distracting_visuals/control" className={buttonStyle + "col-start-5 row-start-3"}>
				Reduce Distracting Visuals (Control)
			</a>

			<a href="/slower_speech/player" className={buttonStyle + "col-start-6 row-start-2"}>
				Slower Speech (Player)
			</a>
			<a href="/slower_speech/control" className={buttonStyle + "col-start-6 row-start-3"}>
				Slower Speech (Control)
			</a>
		</div>
	);
}
