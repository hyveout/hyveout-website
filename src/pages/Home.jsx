import StaticBackground from "../components/StaticBackground";
import mediaGif from "../gifs/media.gif";
import contactGif from "../gifs/contact.gif";
import mindGif from "../gifs/brain.gif";
import gamesGif from "../gifs/games.gif";
import aboutGif from "../gifs/about.gif";
import shopGif from "../gifs/shop.gif";
import "../css/home.css"
import GifLink from "../components/GifLink";
import arrowPng from "../assets/arrow.webp";
import bleoodVideo from "../games/bleood.mp4";
import bleoodPoster from "../games/bleood-thumb.webp";
import Footer from "../components/Footer";
import LoadingScreen from "../components/LoadingScreen";
import useLoading from "../components/useLoading";


function Home() {
    const isLoading = useLoading([
        mediaGif, contactGif, mindGif, gamesGif, aboutGif, arrowPng
    ], 1000);

    if (isLoading) return <LoadingScreen/>



    return (
        <div className="main-border">
            <StaticBackground/>
            <div className="home-container">
                <div className="left-side-gifs">
                    <GifLink 
                        title="MEDIA"
                        image = {mediaGif}
                        alt = "media"
                        path = "/mediaSelect"
                        color = "#ec00ce"
                        newTab = {false}
                    />
                    <GifLink 
                        title="MIND"
                        image = {mindGif}
                        alt = "mind"
                        path = "/mind"
                        color = "#fd395e"
                        newTab = {false}
                    />
                    <GifLink 
                        title="ABOUT"
                        image = {aboutGif}
                        alt = "about"
                        path = "/about"
                        color = "#0ea1ec"
                        newTab = {false}
                    />
                </div>

                <div className="middle-video">
                    <h1 className="latest-text">LATEST</h1>
                    <img className="arrow" src={arrowPng} alt="arrow" loading="lazy"/>
                    <a className="video-wrapper latest-link" href="https://bleood.online/" target="_blank" rel="noopener noreferrer">
                        <video className="latest-video" src={bleoodVideo} poster={bleoodPoster} autoPlay loop muted playsInline/>
                    </a>
                    <h1 className="mid-text">BLEOOD - OFFICIAL WEBSITE</h1>
                </div>

                <div className="right-side-gifs">
                    <GifLink 
                        title="GAMES"
                        image = {gamesGif}
                        alt = "games"
                        path = "/games"
                        color = "#00c600"
                        newTab = {false}
                    />
                    <GifLink 
                        title="SHOP"
                        image = {shopGif}
                        alt = "shop"
                        path = "/shop"
                        disabled
                        color = "#d474c9"
                        newTab = {false}
                    />
                    <GifLink 
                        title="CONTACT"
                        image = {contactGif}
                        alt = "contact"
                        path = "/contact"
                        color = "#9b5af3"
                        newTab = {false}
                    />
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default Home;