import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { useAuthContext } from "../helpers/AuthProvider";
import "../styles/NavBarElement.css"

const NavBarElement = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, loggedIn, isLoaded } = useAuthContext();

  if(!isLoaded) return;

  return (
    <>
        <nav className="NavBarWrapper">
          <Link className="title" to={"/"}>
            Kitchenly
          </Link>
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
            {loggedIn ? 
            <>
              <li>
                <NavLink className="profile" to={"/profile"}>{user.username}</NavLink>
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
