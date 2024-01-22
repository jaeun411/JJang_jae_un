import React, {useState, useEffect, useRef, useCallback/*, useMemo*/} from 'react';
import axios from 'axios';
import { Canvas, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from 'three';
import "./UploadDownloadComponent.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';
import * as Swal from "../../apis/alert";

const Model = ({ url,onObjectClick }) => {
    const [gltf, setGltf] = useState();
    const meshRef = useRef();
    const { camera } = useThree();

    useEffect(() => {
        // GLTF 모델을 로드하고 meshRef에 저장합니다.
        const loader = new GLTFLoader();
        loader.load(url, (gltf) => {
            setGltf(gltf.scene);
            meshRef.current = gltf.scene; // meshRef에 직접 할당
        });
    }, [url]);

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
    }, [onObjectClick, camera, meshRef]);;

    // meshRef를 primitive에 붙여서 참조를 갖도록 합니다.
    return gltf ? (
        <primitive
            ref={meshRef}
            object={gltf}
            scale={0.01}
            onClick={(event) => {
                // React의 이벤트 핸들러를 통해 클릭 이벤트를 처리합니다.
                // 이벤트 버블링을 방지합니다.
                event.stopPropagation();
                onObjectClick(event.object);
            }}
        />
    ) : null;
};

const ObjectDetailsForm = ({ objectDetails, setObjectDetails, onSubmit, onCancel }) => {
    const addMetadataField = () => {
        const newMetadata = [...objectDetails.metadata, { key: '', value: '' }];
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
                </div>
            </div>
        </div>
    );
};

const UploadDownloadComponent = () => {
    const [downloadUrl, setDownloadUrl] = useState('');
    const [gltfUrl, setGltfUrl] = useState('');
    const [labels, setLabels] = useState({});
    const [showDetailsForm, setShowDetailsForm] = useState(false);
    const [objectDetails, setObjectDetails] = useState({ name: '', metadata: [] });
    const [selectedObject, setSelectedObject] = useState(null);

    const handleObjectClick = (object) => {
        setSelectedObject(object);
        setShowDetailsForm(true);
        // 오브젝트의 현재 레이블을 가져와서 입력 폼에 기본값으로 설정합니다.
        setObjectDetails({ name: labels[object.uuid]?.text || object.name || '', metadata: [] });
    };

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

    const handleSubmitDetails = () => {
        //서버로 objectDetails를 전송하는 로직 추가 하기.
        if (selectedObject) {
            updateLabel(objectDetails.name, selectedObject);
        }
        setShowDetailsForm(false);
    };

    const handleCancelDetails = () => {
        setShowDetailsForm(false);
    };

    return (
        <div style={{marginLeft: "150px"}}>
            <div>
                <Canvas style={{height: "1000px", width: "1200px", marginLeft: "20px"}}>
                    <OrbitControls/>
                    <ambientLight intensity={1000}/>
                    <pointLight position={[10, 10, 10]} intensity={1000}/>
                    {gltfUrl && <Model url={gltfUrl} onObjectClick={handleObjectClick}/>}
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
                />
            )}
        </div>
    );
};


export default UploadDownloadComponent;
