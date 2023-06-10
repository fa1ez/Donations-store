import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Button } from 'antd';
import Navbar from './components/Navbar';
import Body from './components/Body';
import Add from './components/Add';
import { Route, BrowserRouter, Routes } from "react-router-dom";

function App() {
  return (
    <div >
      <Navbar/>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Body/>} />
        <Route path="/add" element={<Add/>} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
