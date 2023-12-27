import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {OrbitControls} from "@react-three/drei";

const Box3D = () => {
    const refMesh = useRef();

    return (
        <>
            <directionalLight position={[1, 1, 1]} />

            <axesHelper scale={10}/>
            <OrbitControls/>

            <mesh ref={refMesh}>
                <boxGeometry/>
                <meshStandardMaterial color={'skyblue'} />
            </mesh>
        </>
    );
};

export default Box3D;