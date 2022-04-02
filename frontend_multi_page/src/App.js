import React from "react";
import './App.css';
import Login from "./Login";
import Home from "./Home";
import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className= "App">
        <Route exact path="/" component={Login} />
        <Route path="/home" component={Home} />
      </div>
    </Router>
  );
}

export default App;


