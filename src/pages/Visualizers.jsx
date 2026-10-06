import { useState } from "react";
import BackButton from "../components/BackButton";
import StaticBackground from "../components/StaticBackground";
import "../css/media.css"
import "../css/visualizers.css"
import Footer from "../components/Footer";
import useLoading from "../components/useLoading";
import LoadingScreen from "../components/LoadingScreen";
import visualizers from "../data/visualizers";

function Visualizers() {
    const isLoading = useLoading([], 1000);
    const [activeIndex, setActiveIndex] = useState(0);
    const [hasSelected, setHasSelected] = useState(false);

    if (isLoading) return <LoadingScreen/>

    const active = visualizers[activeIndex];

    return (
        <div className="main-border">
            <StaticBackground/>
            <BackButton path="/mediaSelect"/>
            <div className="media-page">
                <div className="media-left">
                    <div className="media-player">
                        <video
                            key={active.id}
                            className="visualizer-video"
                            src={active.src}
                            poster={active.thumb}
                            controls
                            playsInline
                            preload="metadata"
                            autoPlay={hasSelected}
                        />
                    </div>
                    <h1 className="media-now-playing">{active.title}</h1>
                </div>

                <div className="media-playlist">
                    {visualizers.map((video, i) => (
                        <button
                            key={video.id}
                            className={`media-playlist-item${i === activeIndex ? " active" : ""}`}
                            onClick={() => {
                                setActiveIndex(i);
                                setHasSelected(true);
                            }}
                        >
                            <img className="media-playlist-thumb" src={video.thumb} alt={video.title} loading="lazy"/>
                            <div className="media-playlist-info">
                                <span className="media-playlist-title">{video.title}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default Visualizers;
