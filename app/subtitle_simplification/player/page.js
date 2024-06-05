'use client';

export default function Page() {
  return (
        <div className="bg-black py-4 h-screen text-white text-center grid m-auto">
            <div className="pt-4">
                <a href="/" className="m-auto px-5 py-3">Home 🏠</a>
                <a href="/subtitle_simplification/control" className="m-auto px-5 py-3 mx-3">Controls ⚙</a>
            </div>
            <video controls muted className="mx-auto w-3/5">
				<source src="/BBC_Space/BBC_Space.mp4" type="video/mp4" />
                <track
					id="subtitles"
					label="Simplified"
					kind="subtitles"
					srcLang="en"
					src="/BBC_Space/BBC_Space_simplified.vtt"/>
			</video>
        </div>
    );
}