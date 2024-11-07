import { Outlet } from "react-router";
import NavBarElement from "../components/NavBarElement";
import "../styles/App.css";
import Footer from "../components/Footer";

// contexts
import { AuthProvider } from "../helpers/AuthProvider";

const App = () => {
  return (
    <>
      <AuthProvider>
        <div id="App">
          <NavBarElement/>
          <Outlet/>
          <Footer/>
        </div>
      </AuthProvider>
    </>
  );
};

export default App;
