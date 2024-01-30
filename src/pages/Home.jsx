// Home.jsx
import React, {useContext, useState} from 'react';
import Header from '../components/Header/Header';
import SideBar from "../components/SideBar/SideBar";
import QR from "qrcode.react";
import ThreeJs from "../components/ThreeJs/ThreeJs";

const Home = () => {
    const [gltfBlobUrl, setGltfBlobUrl] = useState(null);
    const [buildingId, setBuildingId] = useState(null);
    const [floorNum, setFloorNum] = useState(null);

    return (
        <>
            <Header/>
            <SideBar setGltfBlobUrl={setGltfBlobUrl} setBuildingId={setBuildingId} setFloorNum={setFloorNum}/>
            <div className='container'>
                <ThreeJs gltfBlobUrl={gltfBlobUrl} buildingId={buildingId} floorNum={floorNum}/>
            </div>
        </>
    )
}

export default Home
