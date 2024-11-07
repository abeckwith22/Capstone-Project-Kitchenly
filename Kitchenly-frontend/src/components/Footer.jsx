import { Link } from "react-router-dom";
import "../styles/Footer.css";

const Footer = () => {
    return (
        <div id="Footer">
            <div className="Info contact">
                <h3>Contact</h3>
                <p>Github: <Link to={"https://github.com/abeckwith22"}>abeckwith22</Link></p>
            </div>
            <div className="Info copyright">
            </div>
        </div>
    );
};

export default Footer;
