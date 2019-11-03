import React, { useState, useEffect } from "react";
import requester from "./helpers/requester";
import "./App.css";

function App() {
  const [welcome, setWelcome] = useState([]);

  useEffect(() => {
    requester
      .get("")
      .then(data => {
        setWelcome(data);
      })
      .catch(err => console.error(err));
  });

  return <div className="App">Message from server: {welcome}</div>;
}

export default App;
