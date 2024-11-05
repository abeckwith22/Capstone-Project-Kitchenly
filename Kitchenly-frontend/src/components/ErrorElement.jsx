import { useRouteError } from "react-router-dom";

const ErrorElement = () => {
    const error = useRouteError();
    console.log(error);

    return (
        <div id="errorElement">
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error occured</p>
            <p>
                <i>{ error.statusText || error.message }</i>
            </p>
        </div>
    );
};

export default ErrorElement;
