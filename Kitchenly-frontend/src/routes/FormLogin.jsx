import "../styles/Form.css";
import useForm from "../hooks/useForm";

const FormLogin = () => {

    const INITIAL_DATA = {
        username: "",
        password: "",
    };

    const { handleChange, handleLogin } = useForm(INITIAL_DATA);

    return (
        <div className="FormContainer">
            <div className="FormContainerBox">
                <div className="FormTitleDiv">
                    <h1 className="FormTitle">Sign in to Kitchenly</h1>
                </div>
                <div className="Form">
                    <form onSubmit={handleLogin}>
                        <div className="FormDiv">
                            <div className="FormInput">
                                <label htmlFor="username">Username</label>
                                <input onChange={handleChange} id="username" name="username" type="text" />
                            </div>
                            <div className="FormInput">
                                <label htmlFor="password">Password</label>
                                <input onChange={handleChange} id="password" name="password" type="password" />
                            </div>
                            <div className="">
                                <button className="FormButton">Sign in</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default FormLogin;
