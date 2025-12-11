import { useState, useEffect } from "react";

// TODO: Move these somewhere else? Or remove completely
const BASE_URL = "http://localhost:8080/api/video";
const PLAYLIST_URL = `${BASE_URL}/playlist`;
const STREAM_BASE_URL = `${BASE_URL}/stream`;

const REFRESH_RATE_MS = 15000;

function VideoPlayer() {
    const [playlist, setPlaylist] = useState<string[]>([]);
    const [index, setIndex] = useState(0);

    function incrementIndex() {
        setIndex(previous => (previous + 1) % playlist.length);
    }

    useEffect(() => {
        async function fetchPlaylist() {
            const response = await fetch(PLAYLIST_URL);
            const data = await response.json();

            setPlaylist(data);
        }

        fetchPlaylist();

        const interval = setInterval(fetchPlaylist, REFRESH_RATE_MS);
        return () => clearInterval(interval);
    }, []);

    return (
        <video 
          autoPlay 
          muted 
          className="w-[80%] h-auto block border-3 border-[#2C2C2C] border-solid" 
          onEnded={incrementIndex}
          src={playlist[index] && `${STREAM_BASE_URL}/${playlist[index]}`}
        />
    )
}

export default VideoPlayer;