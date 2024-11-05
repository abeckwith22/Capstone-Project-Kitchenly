import { Outlet } from "react-router";
import NavBarElement from "../components/NavBarElement";
import "../styles/App.css";

const App = () => {
  return (
    <div id="App">
      <NavBarElement/>
      <Outlet/>
    </div>
  );
};

export default App;
