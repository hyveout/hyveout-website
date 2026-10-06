import { useState } from "react";
import BackButton from "../components/BackButton";
import Footer from "../components/Footer";
import StaticBackground from "../components/StaticBackground";
import "../css/media.css";
import "../css/graphics.css";
import capSwagGraphic from "../graphics/capSwag.webp";
import dc2trillGraphic from "../graphics/dc2trill.webp";
import halfBloodGraphic from "../graphics/halfbloodlogo.webp";
import bloodLuxeGraphic from "../graphics/bloodluxelogo.webp";
import gashGraphic from "../graphics/gash.webp";
import aquaSocksGraphic from "../graphics/aquasocks.webp";
import useLoading from "../components/useLoading";
import LoadingScreen from "../components/LoadingScreen";

const graphics = [
    { id: "aquasocks", title: "AQUASOCKS: BABYHUNCHO OFFICIAL COVER ART", image: aquaSocksGraphic },
    { id: "halfblood", title: "SLAYR: HALFBLOOD OFFICIAL LOGO", image: halfBloodGraphic },
    { id: "bloodluxe", title: "SLAYR: BLOODLUXE OFFICIAL LOGO", image: bloodLuxeGraphic },
    { id: "capswag", title: "CAPTAINSWAG: SWEXGOD VOL. 1 OFFICIAL COVER ART", image: capSwagGraphic },
    { id: "dc2trill", title: "GASH FM: DC2TRILL OFFICIAL FLYER", image: dc2trillGraphic },
    { id: "thirteen", title: "GASH FM: THIRTEEN DEGREES OFFICIAL FLYER", image: gashGraphic },
];

function Graphics() {
    const isLoading = useLoading(graphics.map((g) => g.image), 1000);
    const [activeIndex, setActiveIndex] = useState(0);

    if (isLoading) return <LoadingScreen/>

    const active = graphics[activeIndex];

    return (
        <div className="main-border">
            <StaticBackground/>
            <BackButton path="/mediaSelect"/>
            <div className="media-page">
                <div className="media-left">
                    <div className="media-player">
                        <img className="graphic-view" src={active.image} alt={active.title}/>
                    </div>
                    <h1 className="media-now-playing">{active.title}</h1>
                </div>

                <div className="media-playlist">
                    {graphics.map((g, i) => (
                        <button
                            key={g.id}
                            className={`media-playlist-item${i === activeIndex ? " active" : ""}`}
                            onClick={() => setActiveIndex(i)}
                        >
                            <img className="media-playlist-thumb graphic-thumb" src={g.image} alt="" loading="lazy"/>
                            <div className="media-playlist-info">
                                <span className="media-playlist-title">{g.title}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default Graphics;
