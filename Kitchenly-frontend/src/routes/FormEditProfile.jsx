import "../styles/Form.css";
import useForm from "../hooks/useForm";
import useAuthContext from "../hooks/useAuth";
import { useEffect, useState } from "react";

const FormEditProfile = () => {
    const { user } = useAuthContext();
    const [loaded, setLoaded] = useState(false);

    const INITIAL_DATA = {
        password: "",
        // password2: "",
        first_name: "",
        last_name: "",
        email: "",
    }
    const { handleChange, handleEditProfile } = useForm(INITIAL_DATA);
    
    useEffect(() => {
        if(Object.keys(user).length > 0) setLoaded(true);
    }, [user]);

    if(!loaded) return;

    return (
        <div className="FormContainer">
            <div className="FormContainerBox">
                <div className="FormTitleDiv">
                    <h1 className="FormTitle">Edit {user.username}</h1>
                </div>
                <div className="Form">
                    <form onSubmit={handleEditProfile}>
                        <div className="FormDiv">
                            <div className="FormInput">
                                <label htmlFor="password">Password</label>
                                <input onChange={handleChange} id="password" name="password" type="password" placeholder="**********"/>
                            </div>
                            {/* <div className="FormInput"> - [ ] TODO: Confirm Password
                                <label htmlFor="password2">Confirm Password</label>
                                <input onChange={handleChange} id="password2" name="passwordw" type="password" placeholder="**********"/>
                            </div> */}
                            <div className="FormInput">
                                <label htmlFor="first_name">First Name</label>
                                <input onChange={handleChange} id="first_name" name="first_name" type="text" placeholder={user.first_name}/>
                            </div>
                            <div className="FormInput">
                                <label htmlFor="last_name">Last Name</label>
                                <input onChange={handleChange} id="last_name" name="last_name" type="text" placeholder={user.last_name}/>
                            </div>
                            <div className="FormInput">
                                <label htmlFor="email">Email</label>
                                <input onChange={handleChange} id="email" name="email" type="text" placeholder={user.email}/>
                            </div>
                            <div className="FormSubmit">
                                <button className="FormButton">Submit</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default FormEditProfile;
