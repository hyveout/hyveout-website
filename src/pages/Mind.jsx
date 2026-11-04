import BackButton from "../components/BackButton";
import StaticBackground from "../components/StaticBackground";
import { Link } from "react-router-dom";
import "../css/mind.css"
import creativeDirection from "../data/creativeDirection";
import Footer from "../components/Footer";
import useLoading from "../components/useLoading";
import LoadingScreen from "../components/LoadingScreen";


function Mind() {
    const isLoading = useLoading([], 1000);

    if (isLoading) return <LoadingScreen/>

    return (
        <div className="main-border">
            <StaticBackground/>
            <BackButton path="/home"/>
            <div className="mind-container">
                <p className="mind-section">CREATIVE DIRECTION</p>

                {creativeDirection.map((artist) => (
                    <h1 key={artist.slug} className="mind-artist">
                        <Link to={`/creative/${artist.slug}`} className="mind-link">{artist.name}</Link>
                    </h1>
                ))}

                <p className="mind-section">COLLABORATED ARTISTS</p>

                <h1 className="mind-artist">
                    <a href="https://youtu.be/OseKKumHfW4?list=RDEMCW94n7XJPaGO7gh9VGK99g" target="_blank" className="mind-link">SLAYR</a>
                </h1>

                <h1 className="mind-artist">
                    <a href="https://youtu.be/DFmHkonVCAo?list=RDDFmHkonVCAo" className="mind-link" target="_blank">VAX</a>
                </h1>

                <h1 className="mind-artist">
                    <a href="https://youtu.be/YsNi85aVWeo?list=RDYsNi85aVWeo" target="_blank"
                    className="mind-link">PRETTIFUN</a>
                </h1>

                <h1 className="mind-artist">
                    <a href="https://bleood.online/" target="_blank"
                    className="mind-link">BLEOOD</a>
                </h1>

                <h1 className="mind-artist">
                    <a href="https://youtu.be/aV6qdmObWxA?list=RDaV6qdmObWxA" target="_blank" className="mind-link">MAXXANT</a>
                </h1>

                <h1 className="mind-artist">
                    <a href="https://youtu.be/JQ_k4kDYHNE?list=RDJQ_k4kDYHNE" target="_blank"
                    className="mind-link">EZCODYLEE</a>
                </h1>

                <h1 className="mind-artist">
                    <a href="https://youtu.be/jAVFm6r4tU8?list=RDjAVFm6r4tU8" target="_blank"
                    className="mind-link">SKYTE</a>
                </h1>

                <h1 className="mind-artist">
                    <a href="https://youtu.be/jh6jO0HsJco" target="_blank"
                    className="mind-link">WA</a>
                </h1>

                <h1 className="mind-artist">
                    <a href="https://www.uptownbaby.net/" target="_blank"
                    className="mind-link">KSUUVI</a>
                </h1>

                <h1 className="mind-artist">
                    <a href="https://www.instagram.com/shadx2__/" target="_blank"
                    className="mind-link">SHADX2</a>
                </h1>

                <h1 className="mind-artist">
                    <a href="https://youtu.be/SUJKr6lqCfU" target="_blank"
                    className="mind-link">TURNABOUT</a>
                </h1>

                <h1 className="mind-artist">
                    <a href="https://allure-hyveout.vercel.app/" target="_blank"
                    className="mind-link">ALLURE</a>
                </h1>

                <h1 className="mind-artist">
                    <a href="https://youtu.be/sNIJ3bWSaFg" target="_blank"
                    className="mind-link">OVERTONIGHT</a>
                </h1>

                <h1 className="mind-artist">
                    <a href="https://genius.com/album_cover_arts/1650799" target="_blank"
                    className="mind-link">AQUASOCKS</a>
                </h1>

                <h1 className="mind-artist">
                    <a href="https://genius.com/albums/Captain-swag/Swexgawd-vol-1" target="_blank"
                    className="mind-link">CAPTAIN SWAG</a>
                </h1>

                <h1 className="mind-artist">
                    <a href="https://youtu.be/FyZEULIMtVk" target="_blank"
                    className="mind-link">NINEXTEEN</a>
                </h1>

                <h1 className="mind-artist">
                    <a href="https://www.youtube.com/watch?v=Jfs5cw2lWEA&list=RDJfs5cw2lWEA&start_radio=1" target="_blank"
                    className="mind-link">KARTA</a>
                </h1>

                <h1 className="mind-artist">
                    <a href="https://youtu.be/L7UpdMaXLYs?list=RDL7UpdMaXLYs" target="_blank"
                    className="mind-link">CONFETTI</a>
                </h1>

                <h1 className="mind-artist">
                    <a href="https://www.youtube.com/watch?v=a2_p16fPiTM&list=RDa2_p16fPiTM&start_radio=1" target="_blank"
                    className="mind-link">FAITHLUNA</a>
                </h1>


            </div>
            <Footer/>
        </div>
    )
}

export default Mind;