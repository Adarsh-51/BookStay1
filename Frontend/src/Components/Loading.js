import React from "react";
import { useState } from "react";
import HashLoader from "react-spinners/HashLoader";

function Loading() {
  let [loading, setLoading] = useState(true);
  return (
    <div style={{ marginTop: "160px", marginLeft: "50%" }}>
      <div className="sweet-loading">
        <HashLoader color="#000" loading={loading} css="" size={80} />
      </div>
    </div>
  );
}

export default Loading;
