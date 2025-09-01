import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function A() { return <h1 style={{color:"#fff"}}>A</h1>; }
function B() { return <h1 style={{color:"#fff"}}>B</h1>; }

export default function TestRouter() {
  return (
    <BrowserRouter>
      <nav style={{padding:16}}>
        <Link to="/">A</Link>{" | "}
        <Link to="/b">B</Link>
      </nav>
      <Routes>
        <Route path="/" element={<A />} />
        <Route path="/b" element={<B />} />
      </Routes>
    </BrowserRouter>
  );
}
