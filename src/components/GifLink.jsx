
import { Link } from "react-router"
import "../css/gifLink.css"

function GifLink(props) {
    const { title, image, alt, path, color, newTab, disabled } =  props
    if (disabled) {
        return (
            <div className="gif-container gif-disabled" aria-disabled="true">
                <img className="gifs" src={image} alt={alt} loading="lazy"/>
                <h1 className="caption">{title}</h1>
            </div>
        )
    }

    return (
        <div className="gif-container">
            {newTab ? (
                <a href={path} target="_blank" rel="noopener noreferrer">
                    <img className="gifs" src={image} alt={alt} loading="lazy"/>
                </a>
            ) : (
                <Link to={path}>
                    <img className="gifs" src={image} alt={alt} loading="lazy"/>
                </Link>
            )}

            <h1 className="caption" style={{ color }}>{title}</h1>
        </div>
    )
}

export default GifLink;