import React from "react";
import WebcamFeed from "./WebcamFeed";

const AppUI = () => {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <WebcamFeed />
      </div>
    );
  };
  
  export default AppUI;