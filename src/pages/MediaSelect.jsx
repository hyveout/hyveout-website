
import { Link } from "react-router-dom";
import BackButton from "../components/BackButton";
import Footer from "../components/Footer";
import "../css/select.css"
import StaticBackground from "../components/StaticBackground";

function MediaSelect() {
    return (
        <div className="main-border">
            <StaticBackground/>
            <BackButton path="/home"/>
            <div className="select-choice">
                <Link to={"/media"} className="select-link">
                    <h1 className="select-text">MUSIC VIDEOS</h1>
                </Link>
                <Link to={"/visualizers"} className="select-link">
                    <h1 className="select-text">VISUALIZERS</h1>
                </Link>
                <Link to={"/graphics"} className="select-link">
                    <h1 className="select-text">GRAPHICS/PHOTOS</h1>
                </Link>
            </div>

            <Footer/>
        </div>
    )
}


export default MediaSelect;