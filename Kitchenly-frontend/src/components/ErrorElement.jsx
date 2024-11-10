import { useRouteError } from "react-router-dom";
import "../styles/errorElement.css";

import NavBarElement from "./NavBarElement";
import Footer from "./Footer";

const ErrorElement = () => {
    const error = useRouteError();
    console.log(error);

    return (
        <>
            <div className="container">
                <div id="errorElement">
                    <div className="error">
                        <h1 className="title pacifico-regular">Kitchenly</h1>
                    </div>
                    <h3>Oops! An error occurred.</h3>
                    <div id="errorElementInfo">
                        <p id="code" className="error">{ error.status } Error code.</p>
                        <p id="stack" className="error">
                            <i>{ error.statusText || error.message }</i>
                        </p>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    );
};

export default ErrorElement;
