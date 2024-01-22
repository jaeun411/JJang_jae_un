// Home.jsx
import React, {useContext} from 'react';
import Header from '../components/Header/Header';
import {LoginContext} from '../contexts/LoginContextProvider';
import SideBar from "../components/SideBar/SideBar";
import UploadDownloadComponent from "../components/ThreeJs/UploadDownloadComponent";
import QR from "qrcode.react";

const Home = () => {

    const { isLogin, logout, userInfo } = useContext(LoginContext);

    return (
        <>
            <Header/>
            <SideBar/>
            <div className='container'>
                <UploadDownloadComponent />
            </div>
        </>
    )
}

export default Home
