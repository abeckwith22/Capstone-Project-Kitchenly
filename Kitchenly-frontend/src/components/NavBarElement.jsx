import { Link, NavLink } from "react-router-dom";
import { useContext, useState } from "react";
import "../styles/NavBarElement.css"

const NavBarElement = () => {
  const [menuOpen, setMenuOpen] = useState(false);
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
                <li>
                  <NavLink to={"/signup"}>Sign up</NavLink>
                </li>
                <li>
                  <NavLink to={"/login"}>Login</NavLink>
                </li>
                {/* <li>
                  <NavLink to={"/recipes"}>Saved Recipes</NavLink>
                </li>
                <li>
                  <NavLink to={"/Categories"}>Categories</NavLink>
                </li>
                <li>
                  <NavLink to={"/profile"}>Profile</NavLink>
                </li>
                <li>
                  <NavLink to={"/logout"}>Log out</NavLink>
                </li> */}
          </ul>
        </nav>
    </>
  );
};

export default NavBarElement;
