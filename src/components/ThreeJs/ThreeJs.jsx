// 필요한 리액트 및 써드파티 라이브러리들을 import 합니다.
import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import "./ThreeJs.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import * as Swal from "../../apis/alert";

// 3D 모델을 렌더링하는 Model 컴포넌트
const Model = ({ url,onObjectClick, setnewgltf, setText, setModifiedObjects }) => {

    const [gltf, setGltf] = useState(null);
    const meshRef = useRef();
    const { camera } = useThree();


    //랜더링 될 때 가져온 glb 파일을 로드한다
    useEffect(() => {
        // GLTF 모델을 로드하고 meshRef에 저장합니다.
        const loader = new GLTFLoader();
        loader.load(url, (gltf) => {
            setGltf(gltf.scene);
            setnewgltf(gltf.scene)

        });
    }, [url]);

    // 모델의 클릭 이벤트 핸들링 및 선택된 오브젝트 상태 업데이트
    useEffect(() => {
        if (!meshRef.current) {
            return;
        }
        const handleClick = (event) => {

            const raycaster = new THREE.Raycaster();
            const mouse = new THREE.Vector2(
                (event.clientX / window.innerWidth) * 2 - 1,
                -(event.clientY / window.innerHeight) * 2 + 1
            );
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(meshRef.current.children, true);

            if (intersects.length > 0) {
                onObjectClick(intersects[0].object);
                setModifiedObjects((prevObjects) => ({
                    ...prevObjects,
                    [intersects[0].object.uuid]: intersects[0].object
                }));

            }
        };

        const primitive = meshRef.current;
        primitive.addEventListener('click', handleClick);

        return () => {
            primitive.removeEventListener('click', handleClick);
        };
    }, [onObjectClick, setModifiedObjects, camera, meshRef]);

    // 렌더링

    return gltf ? (
        <group
            ref={meshRef}
            onClick={(event) => {
                event.stopPropagation();
                onObjectClick(event.object);

            }}
        >
            <primitive object={gltf} scale={0.01}/>
        </group>
    ) : null;
};

// 오브젝트의 세부 정보를 수정하는 Form 컴포넌트
const ObjectDetailsForm = ({ objectDetails, setObjectDetails, onSubmit, onCancel, jsonData, selectedObject }) => {
    // 선택된 오브젝트 정보로 폼 필드 초기화
    const populateFormFields = () => {
        if (!selectedObject || !jsonData || !jsonData[selectedObject.name]) {
            // Handle the case where selectedObject or its corresponding data is not available.
            return;
        }

        if (selectedObject && jsonData[selectedObject.name]) {
            const clickedObjectData = jsonData[selectedObject.name];

            if (clickedObjectData) {
                setObjectDetails((prevDetails) => ({
                    ...prevDetails,
                    roomName: clickedObjectData.roomName || '',
                    info: Object.entries(clickedObjectData.info || {}).map(([key, value]) => ({ key, value }))
                }));
            }
        }
    };

    // useEffect를 사용하여 선택된 오브젝트가 변경될 때 폼 필드 업데이트
    useEffect(() => {
        if (selectedObject) {
            populateFormFields();
        }
    }, [selectedObject, jsonData]);

    // 입력 필드 변경 이벤트 핸들러
    const handleInfoInputChange = (e, index, type) => {
        setObjectDetails((prevDetails) => {
            const newInfo = [...prevDetails.info];
            const item = newInfo[index];

            if (type === 'key') {
                return {
                    ...prevDetails,
                    info: newInfo.map((infoItem, i) => (i === index ? { ...infoItem, key: e.target.value } : infoItem))
                };
            } else if (type === 'value') {
                item.value = e.target.value;
            }

            return {
                ...prevDetails,
                info: newInfo
            };
        });
    };

    // 메타데이터 필드 추가
    const addMetadataField = () => {
        setObjectDetails((prevDetails) => ({
            ...prevDetails,
            info: [
                ...prevDetails.info,
                { key: '' , value: '' }
            ]
        }));
    };

    // 방 이름 변경 이벤트 핸들러
    const handleRoomNameChange = (e) => {
        setObjectDetails((prevDetails) => ({
            ...prevDetails,
            roomName: e.target.value
        }));
    };

    // 렌더링
    return (
        <div className="input_con" style={{
            position: 'absolute',
            top: '20%',
            left: '70%',
            background: "#4ce7ae",
            padding: '20px',
            zIndex: 100
        }}>
            {/* 선택된 오브젝트의 이름을 보여주는 레이블과 방 이름 입력 필드 */}
            <div>
                <label style={{display: 'flex', justifyContent: 'center'}}>{objectDetails.roomName}</label>
                <input
                    className="roomName"
                    type="text"
                    value={objectDetails.roomName}
                    onChange={handleRoomNameChange}
                />
            </div>
            <br/>
            <div style={{marginLeft: '10px'}}>
                {/* 오브젝트의 정보를 입력받는 동적 필드들 */}
                {objectDetails.info && objectDetails.info.map((item, index) => (
                    <div key={index}>
                        <input
                            className="text_key"
                            type="text"
                            placeholder="항목"
                            value={item.key}
                            onChange={(e) => handleInfoInputChange(e, index, 'key')}
                        />
                        <input
                            className="text_value"
                            type="text"
                            placeholder="값"
                            value={item.value}
                            onChange={(e) => handleInfoInputChange(e, index, 'value')}
                        />
                        <button className='btn btn-primary btn_remove'>
                            <FontAwesomeIcon icon={faTimes}/>
                        </button>
                    </div>
                ))}
                {/* 메타데이터 필드 추가 버튼 */}
                <button className='btn btn-primary btn_plus' onClick={addMetadataField}>
                    항목 추가
                </button>
            </div>
            <br/>
            <div>
                {/* 저장 및 취소 버튼 */}
                <div className="button-container">
                    <button className="btn btn-primary btn-layer-1_1" onClick={onSubmit} style={{marginRight: '10px'}}>

                        저장
                        <FontAwesomeIcon icon={faCheck}/>
                    </button>
                    <button className="btn btn-primary btn-layer-3_1" onClick={onCancel}>
                        취소
                        <FontAwesomeIcon icon={faTimes}/>
                    </button>

                </div>
            </div>
        </div>
    );
};

// ThreeJs 컴포넌트
const ThreeJs = ({gltfBlobUrl, buildingId, floorNum, jsonData }) => {
    const [labels, setLabels] = useState({});
    //이걸로 건물 정보 입력 모달 상태 관리(true 열림, false 닫힘)
    const [showDetailsForm, setShowDetailsForm] = useState(false);

    //메타 데이터 관리
    const [objectDetails, setObjectDetails] = useState({ name: ''});
    //선택된 오브젝트 관리
    const [selectedObject, setSelectedObject] = useState(null);
    const [modifiedObjects, setModifiedObjects] = useState({});
    const [gltf, setGltf] = useState(null);
    const [data, setData] = useState({});

    // 초기에 JSON 데이터 설정
    useEffect(() => {
        setData(jsonData);
    }, [jsonData]);

    // 오브젝트 클릭 핸들러

    const handleObjectClick = (object) => {
        setSelectedObject(object);
        setShowDetailsForm(true);

        const objectLabels = labels[object.name];

        setObjectDetails({
            name: objectLabels?.text || object.name || '',
        });

        // Check if object.name exists in jsonData before accessing it
        if (jsonData && jsonData[object.name]) {
            const clickedObjectData = jsonData[object.name];

            if (clickedObjectData) {
                setObjectDetails((prevDetails) => ({
                    ...prevDetails,
                    roomName: clickedObjectData.roomName || '',
                    info: Object.entries(clickedObjectData.info || {}).map(([key, value]) => ({ key, value }))
                }));
            }
        }

        console.log('Selected Object UUID:', object.name);

    };

    //오브젝트 정보와 라벨 정보를 넘겨서 띄워준다
    const setText = (objectss) => {
        objectss.map((object)=>{
                // 클릭된 오브젝트의 경계 상자를 계산합니다.
                const box = new THREE.Box3().setFromObject(object);
                const center = new THREE.Vector3();
                box.getCenter(center); // 경계 상자의 중심 좌표를 구합니다.

                // 경계 상자의 크기를 기반으로 적절한 텍스트 크기를 계산합니다.
                const size = box.getSize(new THREE.Vector3());
                const maxSize = Math.max(size.x, size.y, size.z);
                const fontSize = maxSize * 0.1; // 예를 들어, 최대 크기의 10%로 설정합니다.

                // 경계 상자의 최상단에 텍스트를 띄우기 위해 y 좌표를 조정합니다.
                // size.y의 절반을 중심 좌표에 더해 최상단 좌표를 구합니다.
                center.y += size.y / 1.5;
                //const name =txt[object.name].name;

                // 텍스트 레이블 위치와 크기를 오브젝트 중심에 설정합니다.
                setLabels(prevLabels => {
                    return {
                        ...prevLabels,
                        [object.uuid]: {
                            text: jsonData[object.name].roomName,
                            //text: name,
                            position: center.toArray(),
                            fontSize,
                            rotation: [Math.PI / 2  + Math.PI, Math.PI + Math.PI, 0]
                        }
                    };
                });
            }
        );
    };

    // 라벨 업데이트
    const updateLabel = (roomName, object) => {
        const box = new THREE.Box3().setFromObject(object);
        const center = new THREE.Vector3();
        box.getCenter(center);
        const size = box.getSize(new THREE.Vector3());
        const maxSize = Math.max(size.x, size.y, size.z);
        const fontSize = maxSize * 0.1;

        center.y += size.y / 1.5;

        setLabels({
            ...labels,
            [object.uuid]: {
                text: roomName,
                position: center.toArray(),
                fontSize,
                rotation: [Math.PI / 2  + Math.PI, Math.PI + Math.PI, 0]
            }
        });
    };

    const objects = [];


    //모델에서 받아온 scene으로 json 파일의 데이터를 넣는다
    const setnewgltf = (newgltf) => {
        setLabels({});
        setGltf(newgltf);
        console.log(jsonData);
    };

    useEffect(()=>{

        setLabels({});
        if(gltf)
        {
            gltf.traverse((child) => {
                if (child instanceof THREE.Mesh && child.name.includes('polygon')) {
                    objects.push(child)
                }
            });
        }
        // TODO 이거 무한루프 해결해야됨!!!!
      setText(objects)
    },[labels])

    // 세부 정보 저장 핸들러
    const handleSubmitDetails = async () => {
        if (selectedObject) {
            updateLabel(objectDetails.roomName, selectedObject);
            setModifiedObjects((prevObjects) => ({
                ...prevObjects,
                [selectedObject.uuid]: selectedObject
            }));

            // JSON 데이터 업데이트
            setData((prevData) => {
                const updatedData = { ...prevData };

                // 선택된 오브젝트의 이름이 JSON 데이터에 있는지 확인
                if (updatedData[selectedObject.name]) {
                    const updatedObjectData = updatedData[selectedObject.name];

                    // 수정된 세부 정보에 따라 속성 업데이트
                    updatedObjectData.roomName = objectDetails.roomName || '';

                    // 수정된 세부 정보에 따라 info 속성 업데이트
                    updatedObjectData.info = {};
                    objectDetails.info.forEach((item) => {
                        updatedObjectData.info[item.key] = item.value;
                    });
                }

                return updatedData;
            });



            // JSON 데이터를 바이트 배열로 변환
            const jsonDataBytes = new TextEncoder().encode(JSON.stringify(jsonData));

            console.log('Data before sending:', jsonData);

            // Send the updated jsonData to the server as a byte array
            try {
                const response = await axios.put(
                    `/file/${buildingId}/${floorNum}`,
                    jsonDataBytes,
                    {
                        headers: {
                            'Content-Type': 'application/json; charset=UTF-8',
                        },
                    }
                )
            .then(response => {
                    if (response.status === 200) { // 서버에서 success 키를 반환하는지 확인해주세요
                        Swal.alert("수정 성공.", "3D 와 세부정보를 확인해주세요", "success");  // alert를 띄움;
                    } else {
                        Swal.alert("수정 실패", "다시 시도 해주세요.", "warning");  // alert를 띄움
                    }

                });
            } catch (error) {
                console.error('Error updating floor:', error);
            }

            setShowDetailsForm(false);
        }
    };

    // 세부 정보 취소 핸들러
    const handleCancelDetails = () => {
        setShowDetailsForm(false);
    };

    // JSON 다운로드 핸들러
    const handleDownloadJson = () => {
        console.log('data:', jsonData)
        // 데이터 객체를 JSON 문자열로 변환
        const jsonDataString = JSON.stringify(jsonData, null, 2);

        // JSON 문자열로 Blob 생성
        const blob = new Blob([jsonDataString], { type: 'application/json' });

        // 다운로드 링크 생성하고 클릭 이벤트 트리거
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'scene_data.json';
        a.click();
    };

    // 렌더링
    return (
        <div>
            <div style={{ width:"100%" }}>
                {/* 3D 캔버스 */}
                <Canvas
                    style={{width: "100%", height: "100vh"}}
                >
                    <OrbitControls/>
                    <ambientLight intensity={1.0}/>
                    <pointLight position={[10, 10, 10]} intensity={1000}/>
                    {/* 모델 렌더링 */}
                    {gltfBlobUrl && <Model url={gltfBlobUrl} onObjectClick={handleObjectClick}
                                           setModifiedObjects={setModifiedObjects} setnewgltf={setnewgltf} setText={setText}/>}
                    {/* 라벨 렌더링 */}
                    {Object.entries(labels).map(([uuid, label]) => (

                        <Text key={uuid}
                              position={label.position}
                              fontSize={label.fontSize}
                              color="black"
                              anchorX="center"
                              anchorY="middle"
                              rotation={label.rotation}
                              //한글 폰트 추가
                              font={'https://fonts.gstatic.com/ea/notosanskr/v2/NotoSansKR-Bold.woff'}

                        >
                            {label.text}
                        </Text>
                    ))}
                </Canvas>
            </div>
            {/* 세부 정보 폼 렌더링 */}

            {showDetailsForm && (
                <ObjectDetailsForm
                    objectDetails={objectDetails}
                    setObjectDetails={setObjectDetails}
                    onSubmit={handleSubmitDetails}
                    onCancel={handleCancelDetails}
                    jsonData={data}
                    selectedObject={selectedObject}
                />
            )}
            {/* JSON 다운로드 버튼 */}
            <button onClick={handleDownloadJson}>Download JSON</button>

        </div>
    );
};


export default ThreeJs;