import React, {useEffect, useRef, useState} from 'react';
import {Canvas, useThree} from '@react-three/fiber';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {OrbitControls, Text} from "@react-three/drei";
import * as THREE from 'three';
import "./ThreeJs.css";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheck, faTimes} from '@fortawesome/free-solid-svg-icons';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import axios from "axios";
import txt from './text.json'

//-------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------
//glb파일 로드/ 오브젝트 관리
const Model = ({ url,onObjectClick }) => {
    const [gltf, setGltf] = useState(null);
    const meshRef = useRef();
    const { camera } = useThree();

    //랜더링 될 때 가져온 glb 파일을 로드한다
    useEffect(() => {
        // GLTF 모델을 로드하고 meshRef에 저장합니다.
        const loader = new GLTFLoader();
        loader.load(url, (gltf) => {
            setGltf(gltf.scene);
            
            // scene을 순회하면서 오브젝트의 이름을 출력
            gltf.scene.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                  console.log('Object Name:', child.name);
                }
              });
            
        });
    }, [url]);

    //오브젝트 정보와 라벨 정보를 넘겨서 띄워준다
    const updateLabel = (name, object) => {
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

        // 텍스트 레이블 위치와 크기를 오브젝트 중심에 설정합니다.
        setLabels({
            ...labels,
            [object.uuid]: {
                text: name,
                position: center.toArray(),
                fontSize,
                rotation: [Math.PI / 2, Math.PI, 0] // X축과 Y축을 중심으로 회전
            }
        });
    };


    //오브젝트 클릭이랑 카메라 움직임 담당
    useEffect(() => {
        if (!meshRef.current) {
            return; // meshRef.current가 없다면 아무것도 하지 않습니다.
        }
        const handleClick = (event) => {
            // Raycaster를 이용해 클릭된 객체를 찾습니다.
            const raycaster = new THREE.Raycaster();
            const mouse = new THREE.Vector2(
                (event.clientX / window.innerWidth) * 2 - 1,
                -(event.clientY / window.innerHeight) * 2 + 1
            );
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(meshRef.current.children, true);

            if (intersects.length > 0) {
                onObjectClick(intersects[0].object);
            }
        };

        const primitive = meshRef.current;
        primitive.addEventListener('click', handleClick);

        return () => {
            primitive.removeEventListener('click', handleClick);
        };
    }, [onObjectClick, camera, meshRef]);


    // meshRef를 primitive에 붙여서 참조를 갖도록 합니다.
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


//-------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------
//오브젝트 클릭시 나오는 모달 관련
const ObjectDetailsForm = ({objectDetails, setObjectDetails, onSubmit, onCancel, onSaveToServer}) => {
    const addMetadataField = () => {
        const newMetadata = [...objectDetails.metadata, {key: '', value: ''}];
        setObjectDetails({ ...objectDetails, metadata: newMetadata });
    };

    const updateMetadata = (index, key, value) => {
        const newMetadata = [...objectDetails.metadata];
        newMetadata[index] = { ...newMetadata[index], [key]: value };
        setObjectDetails({ ...objectDetails, metadata: newMetadata });
    };

    const removeMetadataField = (index) => {
        const newMetadata = [...objectDetails.metadata];
        newMetadata.splice(index, 1);
        setObjectDetails({ ...objectDetails, metadata: newMetadata });
    };

    return (
        <div className="input_con" style={{ position: 'absolute', top: '20%', left: '70%', background: "#4ce7ae", padding: '20px', zIndex: 100 }}>
            <div>
                <label style={{ display: 'flex', justifyContent: 'center'}}>방 호수</label>
                <input className="text_room"
                    type="text"
                    value={objectDetails.name}
                    onChange={(e) => setObjectDetails({ ...objectDetails, name: e.target.value })}
                />
            </div>
            <br/>
            {objectDetails.metadata.map((meta, index) => (
                <div key={index} style={{marginLeft: '10px'}}>
                    <input className="text_key"
                        type="text"
                        placeholder="항목"
                        value={meta.key}
                        onChange={(e) => updateMetadata(index, 'key', e.target.value)}
                    />
                    <input className="text_value"
                        type="text"
                        placeholder="값"
                        value={meta.value}
                        onChange={(e) => updateMetadata(index, 'value', e.target.value)}
                    />
                    <button onClick={() => removeMetadataField(index)} className='btn btn-primary btn_remove' ><FontAwesomeIcon icon={faTimes}/></button>
                </div>
            ))}
                <button onClick={addMetadataField} className="btn btn-primary btn_plus">
                    항목 추가
                </button>
            <br/>
            <div>
                <div className="button-container">
                    <button className="btn btn-primary btn-layer-1_1" onClick={onSubmit} style={{marginRight:'10px'}}>
                        저장
                        <FontAwesomeIcon icon={faCheck}/>
                    </button>
                    <button className="btn btn-primary btn-layer-3_1" onClick={onCancel}>
                        취소
                        <FontAwesomeIcon icon={faTimes}/>
                    </button>
                    {onSaveToServer && (
                        <button className="btn btn-primary btn-save-to-server" onClick={onSaveToServer}>
                            Save to Server
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

//-------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------
//object에 라벨 처리
const ThreeJs = ({ gltfBlobUrl, buildingId, floorNum  }) => {
    const [downloadUrl, setDownloadUrl] = useState('');
    //객체와 객체에 해당하는 이름을 담는다
    const [labels, setLabels] = useState({});
    //이걸로 건물 정보 입력 모달 상태 관리(true 열림, false 닫힘)
    const [showDetailsForm, setShowDetailsForm] = useState(false);

    //메타 데이터 관리
    const [objectDetails, setObjectDetails] = useState({ name: '', metadata: [] });
    //선택된 오브젝트 관리
    const [selectedObject, setSelectedObject] = useState(null);

    const [gltf, setGltf] = useState(null);
    const meshRef = useRef();


    //클릭된 객체를 처리하는 부분
    const handleObjectClick = (object) => {
        setSelectedObject(object);
        setShowDetailsForm(true);

        // 오브젝트의 메타데이터를 가져와서 입력 폼에 기본값으로 설정합니다.
        // 만약 메타데이터가 없다면 빈 배열을 사용합니다.
        const metadata = object.userData?.metadata || [];

        setObjectDetails({
            name: labels[object.uuid]?.text || object.name || '',
            metadata
        });
    };

    //오브젝트 정보와 라벨 정보를 넘겨서 띄워준다
    const updateLabel = (name, object) => {
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

        // 텍스트 레이블 위치와 크기를 오브젝트 중심에 설정합니다.
        setLabels({
            ...labels,
            [object.uuid]: {
                text: name,
                position: center.toArray(),
                fontSize,
                rotation: [Math.PI / 2, Math.PI, 0] // X축과 Y축을 중심으로 회전
            }
        });
    };

    //상세항목을 담당하는 부분
    const handleSubmitDetails = () => {
        if (selectedObject) {
            selectedObject.userData.metadata = objectDetails.metadata;

            //오브젝트와, 넣을 이름을 넘겨준다
            updateLabel(objectDetails.name, selectedObject);
        }
    };

    const handleSaveToServer = () => {
        if (!gltf) {
            // Use GLTFExporter to export the modified GLB file
            const exporter = new GLTFExporter();
            exporter.parse(gltf, (glb) => {
                // Send the GLB data to the server
                const formData = new FormData();
                formData.append('updateFile', new Blob([glb], { type: 'model/gltf-binary' }), 'modified_model.glb');

                axios.put(`/file/27/1`, formData)
                    .then(response => {
                        // Handle success, e.g., show a success message
                        console.log('File successfully saved to the server');
                    })
                    .catch(error => {
                        // Handle error, e.g., show an error message
                        console.error('Error saving file to the server', error);
                    });
            }, { binary: false });
        }
    };


    //상세항목 닫힘
    const handleCancelDetails = () => {
        setShowDetailsForm(false);
    };
    
    return (
        <div style={{marginLeft: "150px"}}>
            <div>
                <Canvas
                    style={{height: "1000px", width: "1200px", marginLeft: "20px"}}
                >
                    <OrbitControls/>
                    <ambientLight intensity={100.0}/>
                    <pointLight position={[10, 10, 10]} intensity={1000}/>
                    {gltfBlobUrl && <Model url={gltfBlobUrl} onObjectClick={handleObjectClick}/>}
                    {Object.entries(labels).map(([uuid, label]) => (
                        <Text key={uuid}
                              position={label.position}
                              fontSize={label.fontSize}
                              color="black"
                              anchorX="center"
                              anchorY="middle"
                              rotation={label.rotation}
                        >
                            {label.text}
                        </Text>
                    ))}
                </Canvas>
            </div>
            {showDetailsForm && (
                <ObjectDetailsForm
                    objectDetails={objectDetails}
                    setObjectDetails={setObjectDetails}
                    onSubmit={handleSubmitDetails}
                    onCancel={handleCancelDetails}
                    onSaveToServer={handleSaveToServer}
                />
            )}

        </div>
    );
};


export default ThreeJs;