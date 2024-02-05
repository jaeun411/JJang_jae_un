import React, {useCallback, useEffect, useState} from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import {FiFileMinus, FiFilePlus} from "react-icons/fi";
import {IoClose} from "react-icons/io5";
import './UploadModal.css';
import * as auth from "../../apis/auth";
import * as Swal from "../../apis/alert";

const customStyles = {
    overlay: {
    },
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        background: 'transparent',
        border: '2px solid rgba(255, 255, 255, .2)',
        backdropFilter: 'blur(30px)',
        color: '#3c96ef',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0, 0, 0, .2)',
    },
};

Modal.setAppElement('#root'); // accessibility

const UploadModal = ({ isOpen, closeModal }) => {
    const [files, setFiles] = useState([null]); // 선택된 파일들을 저장하는 상태
    const [floorCount, setFloorCount] = useState(1);

    const [buildingDetails, setBuildingDetails] = useState({
        buildingName: '',
        floorCount: floorCount
    });

    useEffect(() => {
        setBuildingDetails(prevDetails => ({
            ...prevDetails,
        }));
    }, [floorCount]);   // userInfo가 변경될 때마다 실행됩니다.

    const handleFileChange = (event, index) => {
        const updatedFiles = [...files];
        updatedFiles[index] = event.target.files[0];
        setFiles(updatedFiles);
    };

    const handleBuildingNameChange = (event) => {
        setBuildingDetails(prevDetails => ({
            ...prevDetails,
            buildingName: event.target.value
        }));
    };

    const handleBuildingFloorsChange = (event) => {
        setBuildingDetails(prevDetails => ({
            ...prevDetails,
            floorCount: event.target.value
        }));
    };


    const handleFileUpload = useCallback(async () => {
        console.log('buildingDetails:', buildingDetails);
        console.log('files:', files);


        const hasEmptyFile = files.includes(null) || buildingDetails.buildingName === '' || buildingDetails.floorCount === '';
        if (hasEmptyFile) {
            alert('모든 정보를 입력해주세요.');
            return;
        }

        // /model 엔드포인트에 파일 업로드 요청
        const formData = new FormData();

        formData.append('buildingName', buildingDetails.buildingName);
        formData.append('floorCount', buildingDetails.floorCount);

        files.forEach((file, index) => {
            if(file != null) {
                formData.append(`files`, file); // 'file'로 key값을 통일하여 서버로 전송
            }
        });

        try {
             auth.session({
                 withCredentials: true // 이 옵션을 설정하여 세션 쿠키를 요청과 함께 보냄
             })
                 .then( response => {
                     return axios.post('/file', formData, {
                         headers: {
                             'Content-Type': 'multipart/form-data'
                         }
                 });
            })
                 .then(response => {
                        if (response.status === 200) { // 서버에서 success 키를 반환하는지 확인해주세요
                            Swal.alert("3D 전환에 성공했습니다.", "사이드 바를 확인해주세요", "success");  // alert를 띄움;
                        } else {
                            Swal.alert("3D 전환에 실패했습니다.", "다시 시도 해주세요.", "warning");  // alert를 띄움
                        }
                 })
            closeModal();
        } catch (error) {
            console.error('Error during the /model request:', error);
            alert('요청 처리 중 에러가 발생했습니다.');
        }
    }, [files, buildingDetails, closeModal]);

    const addFileInput = () => {
        setFiles([...files, null]);
        setFloorCount(prevCount => prevCount + 1); // 층수 증가
    }

    const removeFileInput = (index) => {
        const updatedFiles = [...files];
        updatedFiles.splice(index, 1);
        setFiles(updatedFiles);
        if(floorCount > 1) {
            setFloorCount(prevCount => prevCount - 1); // 층수 감소
        }
    }

    const fileUploadContainerStyle = {
        height: '200px',  // 컨테이너의 원하는 높이 설정
        overflowY: 'auto', // 수직 스크롤바 활성화
        padding: '9px',   // 더 나은 모양을 위해 패딩 추가
        backgroundColor: '#E0FFFF',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0, 0, 0, .2)',
        background: 'transparent',
        border: '2px solid rgba(255, 255, 255, .2)',
        backdropFilter: 'blur(30px)',
    };


    return(
        <Modal
            isOpen={isOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="File Upload Modal"
        >
            <div style={{position: 'relative'}}>
                <button onClick={closeModal} className='btn btn-primary btn-x'><IoClose/></button>
                <br/>
                <br/>
                <h3>뭘 적으면 좋을까...</h3>
                <div >
                    <label>건물 이름:</label>
                    <input
                        type="text"
                        value={buildingDetails.buildingName}
                        placeholder="생성할 건물 이름 입력"
                        className="building_name"
                        onChange={handleBuildingNameChange}
                    />
                    <label>전체 층수:</label>
                    <input
                        type="text"
                        value={floorCount}
                        placeholder="생성할 건물 전체 층 수 입력"
                        className="building_floor"
                        readOnly // 입력을 막음
                        onChange={handleBuildingFloorsChange}
                    />
                </div>
                <br/>
                <div className="file_upload" style={fileUploadContainerStyle}>
                    {files.map((file, index) => (
                        <div key={index}>
                            <input type="file" accept="image/*" onChange={(event) => handleFileChange(event, index)}
                                   style={{marginBottom: '10px'}}/>
                            <button onClick={addFileInput} className='btn btn-primary btn-add'><FiFilePlus/></button>
                            <button onClick={() => removeFileInput(index)} className='btn btn-primary btn-minus'>
                                <FiFileMinus/></button>
                        </div>
                    ))}
                </div>
                <br/>
                <div>
                    <button onClick={handleFileUpload} className='btn btn-primary btn-send'>전송</button>
                </div>
            </div>
        </Modal>
    );
};

export default UploadModal;