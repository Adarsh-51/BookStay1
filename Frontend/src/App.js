import "./App.css";
import Navbar from "./Components/Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomeScreen from "./Screens/HomeScreen";
import BookingScreen from "./Screens/BookingScreen";
import Register from "./Screens/Register";
import Login from "./Screens/Login";
import Profilescreen from "./Screens/Profilescreen";
import LandingScreen from "./Screens/LandingScreen";

function App() {
  return (
    <div className="App">
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path="/home" exact Component={HomeScreen} />
          <Route
            path="/book/:roomid/:fromdate/:todate"
            exact
            Component={BookingScreen}
          />
          <Route path="/register" exact Component={Register} />
          <Route path="/login" exact Component={Login} />
          <Route path="/profile" exact Component={Profilescreen} />
          <Route path="/" exact Component={LandingScreen} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
