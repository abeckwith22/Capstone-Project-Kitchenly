import useForm from "../hooks/useForm";
import "../styles/Form.css";

const FormSignUp = () => {
    const INITIAL_DATA = {
        username: "",
        password: "",
        first_name: "",
        last_name: "",
        email: "",
    }

    const { handleChange, handleSignUp, formData } = useForm(INITIAL_DATA);

    return (
        <div className="FormContainer">
            <div className="FormContainerBox">
                <div className="FormTitleDiv">
                    <h1 className="FormTitle">Sign up for Kitchenly</h1>
                </div>
                <div className="Form">
                    <form onSubmit={handleSignUp}>
                        <div className="FormDiv">
                            <div className="FormInput">
                                <label htmlFor="username">Username</label>
                                <input onChange={handleChange} id="username" name="username" type="text" />
                            </div>
                            <div className="FormInput">
                                <label htmlFor="password">Password</label>
                                <input onChange={handleChange} id="password" name="password" type="password" />
                            </div>
                            <div className="FormInput">
                                <label htmlFor="first_name">First Name</label>
                                <input onChange={handleChange} id="first_name" name="first_name" type="text" />
                            </div>
                            <div className="FormInput">
                                <label htmlFor="last_name">Last Name</label>
                                <input onChange={handleChange} id="last_name" name="last_name" type="text" />
                            </div>
                            <div className="FormInput">
                                <label htmlFor="email">Email</label>
                                <input onChange={handleChange} id="email" name="email" type="text" />
                            </div>
                            <div className="FormSubmit">
                                <button className="FormButton">Sign up</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default FormSignUp;
