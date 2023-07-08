import React from "react";
import { Link } from "react-router-dom";

function LandingScreen() {
  return (
    <div className="row landing justify-content-center">
      <div
        className="col-md-9 text-center"
        style={{ borderRight: "8px solid white" }}
      >
        <h2 style={{ color: "white", fontSize: "100px" }}>BookStay</h2>
        <h5 style={{ color: "white" }}>"There is only one boss. The Guest.</h5>
        <Link to={"/home"}>
          <button className="btn btn-primary landingbtn">Get Started</button>
        </Link>
      </div>
    </div>
  );
}

export default LandingScreen;
