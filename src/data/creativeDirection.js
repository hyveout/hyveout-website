import halfbloodTrailer from "../visualizers/slayr-halfblood-trailer.mp4";
import halfbloodTrailerThumb from "../visualizers/slayr-halfblood-trailer.webp";
import halfbloodLogo from "../graphics/halfbloodlogo.webp";
import bloodluxeTrailer from "../visualizers/slayr-bloodluxe-trailer.mp4";
import bloodluxeTrailerThumb from "../visualizers/slayr-bloodluxe-trailer.webp";
import bloodluxeLogo from "../graphics/bloodluxelogo.webp";
import bobbyVisualizer from "../visualizers/vax-bobby-shmurda.mp4";
import bobbyVisualizerThumb from "../visualizers/vax-bobby-shmurda.webp";
import blueDawn from "../games/bluedawngif.mp4";
import blueDawnThumb from "../games/bluedawn-thumb.webp";
import babyhunchoCover from "../graphics/aquasocks.webp";
import aqSnippet1 from "../creative/aquasocks-snippet-1.mp4";
import aqSnippet1Thumb from "../creative/aquasocks-snippet-1.webp";
import aqSnippet2 from "../creative/aquasocks-snippet-2.mp4";
import aqSnippet2Thumb from "../creative/aquasocks-snippet-2.webp";
import aqSnippet3 from "../creative/aquasocks-snippet-3.mp4";
import aqSnippet3Thumb from "../creative/aquasocks-snippet-3.webp";
import aqVisualizer from "../creative/aquasocks-babyhuncho-visualizer.mp4";
import aqVisualizerThumb from "../creative/aquasocks-babyhuncho-visualizer.webp";

// Creative Direction page data.
// Each artist has:
//   project     -> the album/era name, shown under the artist's name ("" for none)
//   featured    -> the highlight piece shown first, above the description
//   description -> a few sentences on what you did, in your own words
//   sections    -> collapsible groups on the page (Music Videos, Logos, ...),
//                  each with its pieces in order. All start closed. A section
//                  with no pieces yet shows as "SOON" and can't be opened.
// Piece types:
//   "youtube" -> a YouTube video id
//   "video"   -> a video file in this repo (add loop: true for short loops)
//   "image"   -> an image file in this repo
//   "website" -> a looping preview clip plus a link to the live site
const creativeDirection = [
    {
        slug: "slayr",
        name: "SLAYR",
        project: "HALFBLOOD • BLOODLUXE",
        featured: { id: "OseKKumHfW4", type: "youtube", title: "SLOPPY JOE", label: "MUSIC VIDEO" },
        description: "Led the visual rollouts for Slayr's HALFBLOOD and BLOODLUXE eras: designed both album logos, directed and edited the music videos, and cut the trailers and visualizers that set the tone for each release.",
        sections: [
            {
                name: "MUSIC VIDEOS",
                items: [
                    { id: "GXq_3CULKDE", type: "youtube", title: "HOLDING", label: "MUSIC VIDEO" },
                    { id: "D7a3DfNLf7U", type: "youtube", title: "NEVER GO DOWN", label: "MUSIC VIDEO" },
                    { id: "OXI7Aqu-Epo", type: "youtube", title: "DEATH BY MP3", label: "MUSIC VIDEO" },
                    { id: "OseKKumHfW4", type: "youtube", title: "SLOPPY JOE", label: "MUSIC VIDEO" },
                    { id: "3qMLygNGvhM", type: "youtube", title: "DIED BUT CAME BACK", label: "MUSIC VIDEO" },
                    { id: "Z-n_DrZkoi8", type: "youtube", title: "SET IN STONE", label: "MUSIC VIDEO" },
                ],
            },
            {
                name: "LOGOS",
                items: [
                    { id: "hb-logo", type: "image", title: "HALFBLOOD LOGO", label: "OFFICIAL LOGO", src: halfbloodLogo, thumb: halfbloodLogo },
                    { id: "bl-logo", type: "image", title: "BLOODLUXE LOGO", label: "OFFICIAL LOGO", src: bloodluxeLogo, thumb: bloodluxeLogo },
                ],
            },
            {
                name: "TRAILER / VISUALIZER",
                items: [
                    { id: "hb-trailer", type: "video", title: "HALFBLOOD TRAILER", label: "ALBUM TRAILER", src: halfbloodTrailer, thumb: halfbloodTrailerThumb },
                    { id: "bl-trailer", type: "video", title: "BLOODLUXE TRAILER", label: "ALBUM TRAILER", src: bloodluxeTrailer, thumb: bloodluxeTrailerThumb },
                    { id: "eHKoKmM-IgQ", type: "youtube", title: "HALF BLOOD VISUALIZERS", label: "VISUALIZERS" },
                ],
            },
        ],
    },
    {
        slug: "vax",
        name: "VAX",
        project: "BLUE DAWN",
        featured: { id: "DFmHkonVCAo", type: "youtube", title: "BOBBY SHMURDA", label: "MUSIC VIDEO" },
        description: "Creative direction for Vax's BLUE DAWN. Directed the music videos leading up to the album and shaped its visual identity across every release. Built the Blue Dawn website as an interactive teaser, where each snippet video hid a code that unlocked the album's release date and tracklist.",
        sections: [
            {
                name: "MUSIC VIDEOS",
                items: [
                    { id: "2gEYfYQ_yKU", type: "youtube", title: "SO GOOD", label: "MUSIC VIDEO" },
                    { id: "mSHuiXiIK6U", type: "youtube", title: "RACE (FEAT. SLAYR)", label: "MUSIC VIDEO" },
                    { id: "1imE5YlVKTY", type: "youtube", title: "FAMILIA (FEAT. SEVENK)", label: "MUSIC VIDEO" },
                ],
            },
            {
                name: "WEBSITE",
                items: [
                    { id: "blue-dawn", type: "website", title: "BLUE DAWN", label: "WEBSITE", src: blueDawn, thumb: blueDawnThumb, link: "https://bluedawn.online/" },
                ],
            },
            {
                name: "VISUALIZERS",
                items: [
                    { id: "vax-bobby-vis", type: "video", title: "BOBBY SHMURDA VISUALIZER", label: "VISUALIZER", src: bobbyVisualizer, thumb: bobbyVisualizerThumb },
                ],
            },
        ],
    },
    {
        slug: "aquasocks",
        name: "AQUASOCKS",
        project: "BABYHUNCHO",
        // TODO: swap for the Clifford music video once we have its YouTube link
        featured: { id: "aq-featured-cover", type: "image", title: "BABYHUNCHO COVER ART", label: "OFFICIAL COVER ART", src: babyhunchoCover, thumb: babyhunchoCover },
        description: "Shot the official cover for BABYHUNCHO, along with three snippet videos (Toesina Regina, District 21 and Smut) that teased the album ahead of release, then built out its world with visualizers.",
        sections: [
            {
                name: "COVER ART",
                items: [
                    { id: "aq-babyhuncho", type: "image", title: "BABYHUNCHO COVER ART", label: "OFFICIAL COVER ART", src: babyhunchoCover, thumb: babyhunchoCover },
                ],
            },
            {
                name: "SNIPPET VIDEOS",
                items: [
                    { id: "aq-snippet-1", type: "video", title: "TOESINA REGINA", label: "SNIPPET VIDEO", src: aqSnippet1, thumb: aqSnippet1Thumb },
                    { id: "aq-snippet-2", type: "video", title: "DISTRICT 21", label: "SNIPPET VIDEO", src: aqSnippet2, thumb: aqSnippet2Thumb },
                    { id: "aq-snippet-3", type: "video", title: "SMUT", label: "SNIPPET VIDEO", src: aqSnippet3, thumb: aqSnippet3Thumb },
                ],
            },
            {
                name: "VISUALIZERS",
                items: [
                    { id: "aq-babyhuncho-vis", type: "video", loop: true, title: "BABYHUNCHO VISUALIZER", label: "VISUALIZER", src: aqVisualizer, thumb: aqVisualizerThumb },
                ],
            },
        ],
    },
];

export default creativeDirection;
