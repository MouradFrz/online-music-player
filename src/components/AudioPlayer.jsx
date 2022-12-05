import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { FaPauseCircle, FaPlayCircle, FaRandom } from "react-icons/fa";
import { MdSkipPrevious, MdSkipNext } from "react-icons/md";

function AudioPlayer(props) {
	const [playing, setPlaying] = useState(true);
	const [currentSong, setCurrentSong] = useState(false);
	const [songList, setSongList] = useState([]);
	const [randomize, setRandomize] = useState(false);
	const [currentSongDetails, setCurrentSongDetails] = useState({
		currentTime: "0",
	});
	const [currentTime, setCurrentTime] = useState(0);
	const audioRef = useRef(null);
	const seekerRef = useRef(null);

	const nextSong = () => {
		const curSongIndex = songList.indexOf(currentSong);
		const newSongIndex = randomize
			? Math.floor(Math.random() * songList.length)
			: (curSongIndex + 1) % songList.length;
		setCurrentSong(songList[newSongIndex]);
	};
	const prevSong = () => {
		const curSongIndex = songList.indexOf(currentSong);
		const newSongIndex = randomize
			? Math.floor(Math.random() * songList.length)
			: (curSongIndex - 1 + songList.length) % songList.length;

		setCurrentSong(songList[newSongIndex]);
	};
	const randomizer = () => {
		setRandomize((prev) => !prev);
	};
	const playPause = () => {
		playing ? audioRef.current.pause() : audioRef.current.play();
		setPlaying((prev) => !prev);
	};
	const loadSongs = (ev) => {
		const files = Object.values(ev.target.files);
		const newList = [];
		files.forEach((el) => {
			const obj = {
				name: el.name,
				src: URL.createObjectURL(el),
			};
			newList.push(obj);
		});
		setSongList((prev) => prev.concat(newList));
	};
	const setVolume = (ev) => {
		const volume = ev.target.value;
		audioRef.current.volume = volume;
	};
	useEffect(() => {
		audioRef.current?.play();
	}, [currentSong]);
	useEffect(() => {
		const intr = setInterval(() => {
			const currentMinutes = Math.floor(audioRef.current?.currentTime / 60);
			const currentSeconds = Math.floor(audioRef.current?.currentTime % 60);
			setCurrentSongDetails((prev) => ({
				...prev,
				currentTime: `${currentMinutes}:${
					currentSeconds <= 9 ? `0${currentSeconds}` : currentSeconds
				}`,
			}));
		}, 100);
		return () => {
			clearInterval(intr);
		};
	}, []);
	useEffect(() => {
		const totalDuration = audioRef.current?.duration;
		const timeArray = currentSongDetails.currentTime?.split(":");
		const timeInSeconds = parseInt(timeArray[0]) * 60 + parseInt(timeArray[1]);
		if (seekerRef.current) {
			seekerRef.current.value = (timeInSeconds * 100) / totalDuration;
		}
	}, [currentSongDetails]);
	const setSongTime = (ev) => {
		const total = audioRef.current?.duration;
		const value = (ev.target.value * total) / 100;
		setCurrentTime((prev) => ev.target.value);
		audioRef.current.currentTime = value;
	};

	return (
		<div
			className=" h-full
			flex flex-col
			max-h-[600px]
			justify-between items-center
			max-w-[500px] w-full shadow-2xl p-5 relative"
		>
			{songList.length ? (
				""
			) : (
				<label
					htmlFor="file-selector"
					className="mb-5 shadow-sm hover:shadow-md bg-gray-100 w-fit b transition-all cursor-pointer bord rounded-md color-gray-600 hover:border-blue-200 px-3 py-2"
				>
					Add songs
				</label>
			)}
			<div className="max-h-[450px] w-full overflow-y-scroll">
				{songList.map((el) => (
					<div
						onClick={() => {
							setCurrentSong(el);
						}}
						className={`bg-gray-100
						${el.src === currentSong.src ? "bg-gray-200" : ""}
						hover:bg-gray-200 cursor-pointer transition ease-in duration-75 w-full px-2 py-3 border-b-2`}
					>
						{el.name}
					</div>
				))}
				{songList.length ? (
					<label
						htmlFor="file-selector"
						className=" w-full block px-2 py-3 border-b-2 cursor-pointer"
					>
						Add songs
					</label>
				) : (
					""
				)}
			</div>
			{!currentSong ? (
				""
			) : (
				<div className="max-h-[150px] w-full">
					<div>
						<div className="flex relative w-[40%] mt-5 m-auto">
							<input
								type="range"
								value={currentTime}
								ref={seekerRef}
								min={0}
								max={100}
								step={1}
								className="w-[100%]"
								onChange={(ev) => {
									setSongTime(ev);
								}}
							/>
							<p className="absolute text-xs top-2 translate-x-[-100%]">
								{currentSongDetails.currentTime}
							</p>
							<p className="absolute text-xs top-2 left-[100%]">
								{" "}
								{audioRef.current?.duration
									? `${Math.floor(audioRef.current.duration / 60)}:${
											Math.floor(audioRef.current.duration % 60) <= 9
												? `0${Math.floor(audioRef.current.duration % 60)}`
												: Math.floor(audioRef.current.duration % 60)
									  }`
									: "0:00"}
							</p>
						</div>
					</div>
					<div className="flex justify-center mt-5 relative">
						<button
							onClick={randomizer}
							className="absolute top-[50%] translate-y-[-50%] left-4"
						>
							<FaRandom
								className={` ${
									randomize ? "text-blue-400" : "text-gray-400"
								}  text-xs transition-all hover:text-blue-300`}
							/>
						</button>

						<button onClick={prevSong}>
							<MdSkipPrevious className="text-blue-400 text-2xl transition-all hover:text-blue-300" />
						</button>
						<button onClick={playPause}>
							{playing ? (
								<FaPauseCircle className="text-blue-400 text-2xl transition-all hover:text-blue-300" />
							) : (
								<FaPlayCircle className="text-blue-400 text-2xl transition-all hover:text-blue-300" />
							)}
						</button>
						<button onClick={nextSong}>
							<MdSkipNext className="text-blue-400 text-2xl transition-all hover:text-blue-300" />
						</button>

						<input
							type="range"
							min={0}
							max={1}
							step={0.01}
							className="absolute left-[100%] translate-x-[-110%] top-[50%] translate-y-[-50%] w-[70px]"
							onChange={(ev) => {
								setVolume(ev);
							}}
						/>
					</div>
					<p className="text-center text-xs my-2">{currentSong.name}</p>
					<audio ref={audioRef} src={currentSong.src} />
				</div>
			)}
			<input
				multiple
				type="file"
				id="file-selector"
				className="hidden"
				onChange={(ev) => {
					loadSongs(ev);
				}}
			/>
		</div>
	);
}

export default AudioPlayer;
