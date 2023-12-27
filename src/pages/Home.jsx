import React, { useContext } from 'react';
import Header from '../components/Header/Header';
import { LoginContext } from '../contexts/LoginContextProvider';
import FileForm from "../components/FileUpload/FileForm";
import SideBar from "../components/SideBar/SideBar";
import { Canvas } from '@react-three/fiber';
import Box3D from '../components/ThreeJs/Box3D'

const Home = () => {

    const { isLogin, logout, userInfo } = useContext(LoginContext);

    return (
        <>
            <Header />
            <div>
                <div className='container'>
                    <SideBar/>
                    { isLogin &&
                        <>
                            <Canvas>
                                <Box3D/>
                            </Canvas>
                        </>
                    }
                </div>
            </div>
        </>
    )
}

export default Home