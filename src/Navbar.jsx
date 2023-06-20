import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
        <Link to="/">example</Link> /&nbsp;
        <Link to="/SkeletonDetect">start yours</Link> /&nbsp;
        <Link to="/About">about</Link>
    </nav>
  );
}

export default Navbar;