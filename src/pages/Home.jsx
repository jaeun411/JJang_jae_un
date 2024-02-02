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
    const [jsonData, setJsonData] = useState({});

    return (
        <>
            <Header/>
            <SideBar setGltfBlobUrl={setGltfBlobUrl} setBuildingId={setBuildingId} setFloorNum={setFloorNum} setJsonData={setJsonData}/>
            <div className='container'>
                <ThreeJs gltfBlobUrl={gltfBlobUrl} buildingId={buildingId} floorNum={floorNum} jsonData={jsonData}/>
            </div>
        </>
    )
}

export default Home