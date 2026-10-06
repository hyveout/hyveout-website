import BackButton from "../components/BackButton";
import StaticBackground from "../components/StaticBackground";
import "../css/contact.css"
import Footer from "../components/Footer";

function Contact() {
    return (
        <div className="main-border">
            <StaticBackground/>
            <BackButton path="/home"/>
            <div className="contact-container">
                <a className="contact-email" href="mailto:hyveoutstaff@gmail.com">hyveoutstaff@gmail.com</a>
            </div>
            <Footer/>
        </div>
    )
}

export default Contact;
