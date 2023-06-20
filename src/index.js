import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import SkeletonDetect from './components/SkeletonDetect';
import Show3d from './components/Show3d';
import About from "./components/About";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
        <Route path="/" element={<Layout />}>
            <Route index element={<App />}></Route>
            <Route path='/SkeletonDetect' element={<SkeletonDetect />}></Route>
            <Route path='/Show3d' element={<Show3d />}></Route>
            <Route path='/About' element={<About />}></Route>
        </Route>
    </Routes>
  </BrowserRouter>
);
reportWebVitals();
