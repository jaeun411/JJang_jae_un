import React, { useContext } from 'react';
import Header from '../components/Header/Header';
import { LoginContext } from '../contexts/LoginContextProvider';
import FileForm from "../components/FileUpload/FileForm";
import SideBar from "../components/SideBar/SideBar";
import SideBarForm from "../components/SideBar/SideBar";
import './Home.css';
const Home = () => {

    const { isLogin, userInfo } = useContext(LoginContext);

    return (
        <>
            <Header/>
            <div className='container'>
                <SideBarForm status={isLogin}/>
                <hr/>
            </div>
            <div className='container2'>
                <FileForm/>
                <button>전환</button>
            </div>
        </>
    );
}

export default Home