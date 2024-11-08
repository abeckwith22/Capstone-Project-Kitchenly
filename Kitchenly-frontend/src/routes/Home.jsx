import { useAuthContext } from "../helpers/AuthProvider";
import { Link } from "react-router-dom";
import "../styles/Form.css";
import { useEffect } from "react";
import { useState } from "react";

const Home = () => {
    const { user } = useAuthContext();

    return user.username ?
    (
        <div className="FormContainer">
            <div className="FormContainerBox">
                <div className="FormTitleDiv">
                    <h1 className="FormTitle title">Kitchenly</h1>
                    <p className="FormCaption"><i>Welcome {user.username}</i></p>
                </div>
            </div>
        </div>
    ) :
    (
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

    )
};

export default Home;
