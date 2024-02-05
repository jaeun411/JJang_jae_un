import React, {useState} from 'react';
import { useLocation } from 'react-router-dom';
import GuestSideBar from "../components/GuestSideBar/GuestSideBar";
import GuestThreeJs from "../components/GuestThreeJs/GuestThreeJs";

const UserPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    //  const searchParams = location.search;
    //  const query = queryString.parse(searchParams); //사용
    //  const [buildingId, setBuildingId] = useState(query.buildingId); // 건물 아이디

    const [buildingId, setBuildingId] = useState(queryParams.get("buildingId")); // 건물 아이디

    let [gltfBlobUrl, setGltfBlobUrl] = useState(null); //  gltf 파일 blob url

    const [jsonData, setJsonData] = useState({});

    return (
        <>
            <header style={{backgroundColor : 'white'}}>
                <GuestSideBar buildingId={buildingId} setBuildingId={setBuildingId} setGltfBlobUrl={setGltfBlobUrl} setJsonData={setJsonData}/>
            </header>
            <div >
                <GuestThreeJs gltfBlobUrl={gltfBlobUrl} jsonData={jsonData}/>
            </div>
        </>
    );
}
export default UserPage;