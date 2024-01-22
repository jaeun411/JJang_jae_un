import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import LoginContextProvider from './contexts/LoginContextProvider';
import About from './pages/About';
import Home from './pages/Home';
import Join from './pages/Join';
import Login from './pages/Login';
import User from './pages/User';
import Admin from './pages/Admin';
import File from './pages/File';
import SnowEffect from './SnowEffect'; // SnowEffect 컴포넌트를 import 합니다.

const App = () => {
  return (
    <BrowserRouter>
      <LoginContextProvider>
        <SnowEffect /> {/* 모든 페이지에 눈내리는 효과를 추가합니다. */}
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Login />} />
          <Route path="/join" element={<Join />} />
          <Route path="/user" element={<User />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/FileUpload" element={<File />}/>
        </Routes>
      </LoginContextProvider>
    </BrowserRouter>
  );
};

export default App;
