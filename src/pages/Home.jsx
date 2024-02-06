// Home.jsx
import React, {useState} from 'react';
import Header from '../components/Header/Header';

import ThreeJs from "../components/ThreeJs/ThreeJs";

const Home = () => {
    const [gltfBlobUrl, setGltfBlobUrl] = useState(null);
    const [buildingId, setBuildingId] = useState(null);
    const [floorNum, setFloorNum] = useState(null);
    const [jsonData, setJsonData] = useState(null);

    return (
        <>
            <Header setGltfBlobUrl={setGltfBlobUrl}
                    setBuildingId={setBuildingId}
                    setFloorNum={setFloorNum}
                    setJsonData={setJsonData} />

            <ThreeJs gltfBlobUrl={gltfBlobUrl} buildingId={buildingId} floorNum={floorNum} jsonData={jsonData}/>

        </>
    )
}

export default Home