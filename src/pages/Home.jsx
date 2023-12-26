import React, { useContext } from 'react';
import Header from '../components/Header/Header';
import { LoginContext } from '../contexts/LoginContextProvider';
import FileForm from "../components/FileUpload/FileForm";
import SideBar from "../components/SideBar/SideBar";

const Home = () => {

    const { isLogin, logout, userInfo } = useContext(LoginContext);

    return (
        <>
            <Header />
            <div>
                <div className='container'>
                    { isLogin &&
                        <>
                            <h3><span style={{color: 'blue'}}>{userInfo.userId}</span> 님 환영합니다.</h3>
                            <hr/>
                            <FileForm/>
                            <button>전환</button>
                        </>
                    }
                </div>
            </div>

        </>
    )
}

export default Home