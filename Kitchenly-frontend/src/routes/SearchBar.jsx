import "../styles/SearchBar.css";
import useForm from "../hooks/useForm";

const SearchBar = () => {

    const INITIAL_STATE = {
        title: "",
    };

    const { handleSearch, handleChange, formData } = useForm(INITIAL_STATE);

    return (
        <div className="SearchBarContainer">
            <form onSubmit={handleSearch} className="SearchBar">
                <input onChange={handleChange} type="text" name="title" placeholder="&#x1F50D; Find a recipe"/>
            </form>
        </div>
    )
}

export default SearchBar;
