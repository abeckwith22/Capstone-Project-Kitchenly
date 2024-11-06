import { Link } from "react-router-dom";
import "../styles/Form.css";

const Home = () => {
    return (
        <div className="FormContainer">
            <div className="FormContainerBox">
                <div className="FormTitleDiv">
                    <h1 className="FormTitle">Kitchenly</h1>
                    <p className="FormCaption"><i>For all your cooking needs.</i></p>
                </div>
                <div className="Form">
                    <form>
                        <div className="FormDiv">
                            <Link className="FormLink" to="/login">Login</Link>
                            <Link className="FormLink" to="/signup">Sign up</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Home;
