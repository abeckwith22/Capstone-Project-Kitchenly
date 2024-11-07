import { useAuthContext } from "../helpers/AuthProvider";
import { Link } from "react-router-dom";
import "../styles/Form.css";

const Home = () => {
    const { user, loggedIn, isLoaded } = useAuthContext();
    let data;

    if(!isLoaded) return;

    if(loggedIn) {
        data = (
            <div className="FormContainer">
                <div className="FormContainerBox">
                    <div className="FormTitleDiv">
                        <h1 className="FormTitle title">Kitchenly</h1>
                        <p className="FormCaption"><i>Welcome {user.username}</i></p>
                    </div>
                </div>
            </div>
        )
    } else {
        data = (
            <div className="FormContainer">
                <div className="FormContainerBox">
                    <div className="FormTitleDiv">
                        <h1 className="FormTitle title">Kitchenly</h1>
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
    }

    return data;

};

export default Home;
