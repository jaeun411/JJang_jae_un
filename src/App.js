import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import LoginContextProvider from './contexts/LoginContextProvider';
import Home from './pages/Home';
import Join from './pages/Join';
import Login from './pages/Login';
import UserPage from './pages/UserPage';
import File from './pages/File';
import SnowEffect from './SnowEffect';
import {BrowserView, MobileView} from "react-device-detect"; // SnowEffect 컴포넌트를 import 합니다.
//import { BrowserView, MobileView } from 'react-device-detect'

const App = () => {
  return (
      <BrowserRouter>                {/* URL 관리, 브라우저의 주소를 처리 */}
        <LoginContextProvider>       {/* 로그인 관리 */}
          {/*<SnowEffect/> /!* 모든 페이지에 눈내리는 효과를 추가합니다. *!/*/}
          <Routes>                   {/* 어떤 컴포넌트를 렌더링할지 결정하는 역할 */}
            <Route path="/home" element={<Home/>}/>
            <Route path="/" element={<Login/>}/>
            <Route path="/join" element={<Join/>}/>
            <Route path="/FileUpload" element={<File/>}/>
            <Route path="/guest/" element={<UserPage/>}/>
          </Routes>
        </LoginContextProvider>
        <div className="App">
          <BrowserView/>
          <MobileView/>
        </div>
      </BrowserRouter>
  );
};

export default App;
