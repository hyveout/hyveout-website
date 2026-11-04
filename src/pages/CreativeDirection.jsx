import { useEffect, useRef, useState } from "react";
import BackButton from "../components/BackButton";
import StaticBackground from "../components/StaticBackground";
import Footer from "../components/Footer";
import useLoading from "../components/useLoading";
import LoadingScreen from "../components/LoadingScreen";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import "../css/creativeDirection.css";
import arrow from "../assets/arrow.webp";
import creativeDirection from "../data/creativeDirection";

function thumbFor(item) {
    if (item.type === "youtube") return `https://i.ytimg.com/vi/${item.id}/mqdefault.jpg`;
    return item.thumb;
}

function Viewer({ item, autoplay }) {
    if (item.type === "youtube") {
        return <LiteYouTubeEmbed key={item.id} id={item.id} title={item.title} autoplay={autoplay}/>;
    }
    if (item.type === "website") {
        return (
            <video key={item.id} className="cd-view" src={item.src} poster={item.thumb}
                autoPlay loop muted playsInline/>
        );
    }
    if (item.type === "video") {
        return (
            <video key={item.id} className="cd-view" src={item.src} poster={item.thumb}
                controls playsInline preload="metadata" loop={item.loop}
                autoPlay={autoplay || item.loop} muted={item.loop}/>
        );
    }
    return <img key={item.id} className="cd-view" src={item.src} alt={item.title}/>;
}

// The open section: viewer with arrows, caption, and thumbnails.
function SectionPlayer({ items, index, onSelect, autoplay }) {
    const piece = items[index];
    const many = items.length > 1;

    return (
        <div className="cd-section-body">
            <div className="cd-stage">
                {many && (
                    <button className="cd-arrow cd-arrow-prev" onClick={() => onSelect(index - 1)} aria-label="Previous">
                        <img src={arrow} alt=""/>
                    </button>
                )}
                <div className="cd-player">
                    <Viewer item={piece} autoplay={autoplay}/>
                </div>
                {many && (
                    <button className="cd-arrow cd-arrow-next" onClick={() => onSelect(index + 1)} aria-label="Next">
                        <img src={arrow} alt=""/>
                    </button>
                )}
            </div>

            <div className="cd-caption">
                <span className="cd-title">{piece.title}</span>
                <span className="cd-meta">
                    {[piece.label, many && `${index + 1}/${items.length}`].filter(Boolean).join(" • ")}
                </span>
                {piece.link && (
                    <a className="cd-visit" href={piece.link} target="_blank" rel="noopener noreferrer">
                        &gt;VISIT SITE&lt;
                    </a>
                )}
            </div>

            {many && (
                <div className="cd-strip">
                    {items.map((p, i) => (
                        <button
                            key={p.id}
                            className={`cd-strip-item${i === index ? " active" : ""}`}
                            onClick={() => onSelect(i)}
                            aria-label={p.title}
                            title={p.title}
                        >
                            <img src={thumbFor(p)} alt="" loading="lazy"/>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

function CreativeDirection({ artist: initialArtist }) {
    const isLoading = useLoading([], 1000);
    const [artistIndex, setArtistIndex] = useState(() =>
        Math.max(0, creativeDirection.findIndex((a) => a.slug === initialArtist)));
    const [openSection, setOpenSection] = useState(-1);
    const sectionRefs = useRef([]);

    // When a section opens, scroll it to the top so its viewer is in view.
    useEffect(() => {
        const el = sectionRefs.current[openSection];
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, [openSection, artistIndex]);
    const [pieceIndex, setPieceIndex] = useState(0);
    const [hasInteracted, setHasInteracted] = useState(false);

    if (isLoading) return <LoadingScreen/>

    const artist = creativeDirection[artistIndex];

    const selectArtist = (i) => {
        setArtistIndex(i);
        setOpenSection(-1);
        setPieceIndex(0);
        setHasInteracted(false);
    };

    const toggleSection = (i) => {
        setOpenSection(openSection === i ? -1 : i);
        setPieceIndex(0);
        setHasInteracted(false);
    };

    const selectPiece = (items) => (i) => {
        setPieceIndex((i + items.length) % items.length);
        setHasInteracted(true);
    };

    return (
        <div className="main-border">
            <StaticBackground/>
            <BackButton path="/mind"/>
            <div className="cd-page">
                <nav className="cd-tabs">
                    {creativeDirection.map((a, i) => (
                        <button
                            key={a.slug}
                            className={`cd-tab${i === artistIndex ? " active" : ""}`}
                            onClick={() => selectArtist(i)}
                        >
                            {a.name}
                        </button>
                    ))}
                </nav>

                <div className="cd-body">
                    <section className="cd-about">
                        <h1 className="cd-name">{artist.name}</h1>
                        <p className="cd-role">
                            CREATIVE DIRECTION{artist.project && ` • ${artist.project}`}
                        </p>
                        {artist.featured && (
                            <figure className="cd-featured">
                                <div className="cd-player cd-featured-player">
                                    <Viewer item={artist.featured} autoplay={false}/>
                                </div>
                                <figcaption className="cd-caption">
                                    <span className="cd-featured-tag">FEATURED</span>
                                    <span className="cd-title">{artist.featured.title}</span>
                                    <span className="cd-meta">{artist.featured.label}</span>
                                </figcaption>
                            </figure>
                        )}
                        <p className="cd-description">{artist.description}</p>
                    </section>

                    <div className="cd-sections">
                        {artist.sections.map((section, i) => {
                            const isOpen = i === openSection;
                            const isEmpty = section.items.length === 0;
                            return (
                                <section
                                    key={section.name}
                                    ref={(el) => { sectionRefs.current[i] = el; }}
                                    className={`cd-section${isOpen ? " open" : ""}${isEmpty ? " empty" : ""}`}
                                >
                                    <button
                                        className="cd-section-head"
                                        onClick={() => toggleSection(i)}
                                        aria-expanded={isOpen}
                                        disabled={isEmpty}
                                    >
                                        <span className="cd-section-name">{section.name}</span>
                                        <span className="cd-section-count">{isEmpty ? "SOON" : section.items.length}</span>
                                        {!isEmpty && <img className="cd-section-arrow" src={arrow} alt=""/>}
                                    </button>
                                    {isOpen && (
                                        <SectionPlayer
                                            items={section.items}
                                            index={pieceIndex}
                                            onSelect={selectPiece(section.items)}
                                            autoplay={hasInteracted}
                                        />
                                    )}
                                </section>
                            );
                        })}
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default CreativeDirection;
