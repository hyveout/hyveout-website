import BackButton from "../components/BackButton";
import GameCard from "../components/GameCard";
import StaticBackground from "../components/StaticBackground";
import ghostGameGif from "../games/GHOST_GAME.mp4";
import fragmentGameGif from "../games/fragmentGame.mp4";
import allureGif from "../games/allure.mp4";
import pfyGame from "../games/pfy_game.mp4";
import bluedawnGame from "../games/bluedawngif.mp4";
import ksuuviGame from "../games/ksuuvi.mp4";
import konbiniGame from "../games/konbini108.mp4";
import translateGame from "../games/translate.mp4";
import ultrapinkGame from "../games/ultrapink.mp4";
import "../css/games.css"
import Footer from "../components/Footer";
import useLoading from "../components/useLoading";
import LoadingScreen from "../components/LoadingScreen";

function Games() {
    const isLoading = useLoading(
        [ghostGameGif, fragmentGameGif, allureGif, pfyGame, bluedawnGame, ksuuviGame, konbiniGame, translateGame, ultrapinkGame],
        6000);
    
    if (isLoading) return <LoadingScreen/>

    return (
        <div className="main-border">
            <StaticBackground/>
            <BackButton path="/home" />
            <div className="game-container">
                <GameCard
                    title = "KSUUVI: OFFICIAL WEBSITE"
                    image = {ksuuviGame}
                    alt = "kssuvi game"
                    path = "https://www.uptownbaby.net/"
                />

                <GameCard
                    title = "ONE OR EIGHT: KONBINI"
                    image = {konbiniGame}
                    alt = "konibini game"
                    path = "https://konbini.crewpass108.com/"
                />

                <GameCard
                    title = "ONE OR EIGHT: TRANSLATE"
                    image = {translateGame}
                    alt = "one or eight translate game"
                    path = "https://translate.crewpass108.com/"
                />

                <GameCard 
                    title="VAX: BLUE DAWN"
                    image = {bluedawnGame}
                    alt = "vax blue dawn"
                    path = "https://bluedawn.online/"
                />

                <GameCard 
                    title="PRAYFORYOUTH: PFY + FRIENDS"
                    image = {pfyGame}
                    alt = "PFY + FRIENDS"
                    path = "https://hyveout-prayforyouth.vercel.app/"
                />

                <GameCard
                    title = "SHADX2: ULTRAPINK DRUMKIT"
                    image = {ultrapinkGame}
                    alt = "shadx2 ultrapink drumkit"
                    path = "https://x2.shadx2.net/"
                />

                <GameCard 
                    title="ALLURE: POP-UP ANNOUNCEMENT"
                    image = {allureGif}
                    alt = "Allure game"
                    path = "https://allure-hyveout.vercel.app/"
                />

                <GameCard 
                    title="NINEXTEEN: GHOST"
                    image = {ghostGameGif}
                    alt = "Ghost game gif"
                    path = "https://hyveout-ghosts.vercel.app/"
                />

                <GameCard
                    title = "EATMYNOODLE FRAGMENT"
                    image = {fragmentGameGif}
                    alt = "fragment game gif"
                    path = "https://hyveout-fragments-game.vercel.app/"
                />
            </div>
            <Footer/>
        </div>
    )
}

export default Games;