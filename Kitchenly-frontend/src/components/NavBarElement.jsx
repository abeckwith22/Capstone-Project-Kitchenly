import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { useAuthContext } from "../helpers/AuthProvider";
import "../styles/NavBarElement.css"
import SearchBar from "../routes/SearchBar";

const NavBarElement = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isLoaded } = useAuthContext();

  if(!isLoaded) return;

  return (
    <>
        <nav className="NavBarWrapper">
          <Link className="title" to={"/"}>
            Kitchenly
          </Link>
          <SearchBar/>
          <div
            className="menu"
            onClick={() => {
              setMenuOpen(!menuOpen);
            }}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
          <ul className={menuOpen ? "open" : ""}>
            {user.username ? 
            <>
              <li>
                <NavLink className="newRecipe" to={"/recipes/new"}>New Recipe</NavLink>
              </li>
              <li>
                <NavLink className="profile" to={"/profile"}>Profile</NavLink>
              </li>
              <li>
                <NavLink to={"/logout"}>Logout</NavLink>
              </li>
            </>
            : 
            <>
              <li>
                <NavLink to={"/signup"}>Sign up</NavLink>
              </li>
              <li>
                <NavLink to={"/login"}>Login</NavLink>
              </li>
            </>
            }
          </ul>
        </nav>
    </>
  );
};

export default NavBarElement;
