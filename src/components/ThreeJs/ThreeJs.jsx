import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from 'three';
import "./ThreeJs.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import axios from "axios";

const Model = ({ url, onObjectClick, setModifiedObjects }) => {
    const [gltf, setGltf] = useState(null);
    const meshRef = useRef();
    const { camera } = useThree();

    useEffect(() => {
        const loader = new GLTFLoader();
        loader.load(url, (gltf) => {
            console.log('Loaded GLTF:', gltf);
            setGltf(gltf.scene);
        });
    }, [url]);

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

    return gltf ? (
        <group
            ref={meshRef}
            onClick={(event) => {
                event.stopPropagation();
                onObjectClick(event.object);
            }}
        >
            <primitive object={gltf} scale={0.01} />
        </group>
    ) : null;
};

const ObjectDetailsForm = ({ objectDetails, setObjectDetails, onSubmit, onCancel }) => {

    return (
        <div className="input_con" style={{ position: 'absolute', top: '20%', left: '70%', background: "#4ce7ae", padding: '20px', zIndex: 100 }}>
            <div>
                <label style={{ display: 'flex', justifyContent: 'center' }}>{objectDetails.name}</label>
                {/* Additional code for displaying the name of the selected object */}
            </div>
            <br/>
            <button className="btn btn-primary btn_plus">
                항목 추가
            </button>
            <br/>
            <div>
                <div className="button-container">
                    <button className="btn btn-primary btn-layer-1_1" onClick={onSubmit} style={{ marginRight: '10px' }}>
                        저장
                        <FontAwesomeIcon icon={faCheck} />
                    </button>
                    <button className="btn btn-primary btn-layer-3_1" onClick={onCancel}>
                        취소
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
            </div>
        </div>
    );
};

const ThreeJs = ({ gltfBlobUrl }) => {
    const [labels, setLabels] = useState({});
    const [showDetailsForm, setShowDetailsForm] = useState(false);
    const [objectDetails, setObjectDetails] = useState({ name: '' });
    const [selectedObject, setSelectedObject] = useState(null);
    const [modifiedObjects, setModifiedObjects] = useState({});

    const handleObjectClick = (object) => {
        setSelectedObject(object);
        setShowDetailsForm(true);

        const objectLabels = labels[object.uuid];

        setObjectDetails({
            name: objectLabels?.text || object.name || '',
        });
    };

    const handleCancelDetails = () => {
        setShowDetailsForm(false);
    };

    return (
        <div style={{ marginLeft: "150px" }}>
            <div>
                <Canvas
                    style={{ height: "1000px", width: "1200px", marginLeft: "20px" }}
                >
                    <OrbitControls />
                    <ambientLight intensity={100.0} />
                    <pointLight position={[10, 10, 10]} intensity={1000} />
                    {gltfBlobUrl && <Model url={gltfBlobUrl} onObjectClick={handleObjectClick} setModifiedObjects={setModifiedObjects} />}
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
                    onCancel={handleCancelDetails}
                />
            )}
        </div>
    );
};

export default ThreeJs;