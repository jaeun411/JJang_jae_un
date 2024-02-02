import React, {useState, useCallback, useRef} from 'react'
import Modal from 'react-modal';
import {IoClose} from "react-icons/io5";
import '../UploadModal/UploadModal.css';
import axios from 'axios';
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
const UpdateSidebar = ({upmodalIsOpen,closeUpdate, buildingData}) => {

    const fileInputRef = useRef(null);
    const [file, setFiles] = useState(null);

    const handleFileChange = (event) => {
        const selectedFile = fileInputRef.current.files[0];
        setFiles(selectedFile);
    };
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

    const handleFileUpload = () => {

        console.log("파일 전송 하는 함수");
        try {
            const formData = new FormData();
            if(file != null) {
                formData.append(`file`, file); // 'file'로 key값을 통일하여 서버로 전송
            }
            console.log("업데이트 사이드바",buildingData);
                     
            const url = `http://220.90.179.77:8082/file/${buildingData.buildingName}/${buildingData.floorCount}`

            axios.put(url, formData, {
                headers: {
                      'Content-Type': 'multipart/form-data'
            }})
            .then(response=>{
                if (response.status === 200) { // 서버에서 success 키를 반환하는지 확인해주세요
                    Swal.alert("수정 성공했습니다.", "사이드 바를 확인해주세요", "success");  // alert를 띄움;
                } else {
                    Swal.alert("수정 실패했습니다.", "다시 시도 해주세요.", "warning");  // alert를 띄움
                }
            })

            closeUpdate();
        }catch (error) {
           console.error('Error during the /model request:', error);
           alert('요청 처리 중 에러가 발생했습니다.');
       }
    };
    
    // const handleFileUpload = useCallback(async () => {

    //     // /model 엔드포인트에 파일 업로드 요청
    //     const formData = new FormData();

    //     // formData.append('buildingName', buildingData.buildingName);
    //     // formData.append('floorCount', buildingData.floorCount);

    //     files.forEach((file, index) => {
    //         if(file != null) {
    //             formData.append(`files`, file); // 'file'로 key값을 통일하여 서버로 전송
    //         }
    //     });

    //     try {
    //          auth.session({
    //              withCredentials: true // 이 옵션을 설정하여 세션 쿠키를 요청과 함께 보냄
    //          })
    //              .then( response => {
    //                 //  const user_id = response.data;

    //                  // 추출한 user_id를 formData에 추가합니다.
    //                 //  formData.append('user_id', user_id);

    //                  console.log("업데이트 사이드바",buildingData);
                     
    //                  const url = `http://10.101.69.52:8000/file/${buildingData.buildingName}/${buildingData.floorCount}`

    //                  return axios.put(url, formData, {
    //                      headers: {
    //                          'Content-Type': 'multipart/form-data'
    //                      }
    //              });
    //         })
    //              .then(response => {

    //                     if (response.status === 200) { // 서버에서 success 키를 반환하는지 확인해주세요
    //                         Swal.alert("3D 전환에 성공했습니다.", "사이드 바를 확인해주세요", "success");  // alert를 띄움;
    //                     } else {
    //                         Swal.alert("3D 전환에 실패했습니다.", "다시 시도 해주세요.", "warning");  // alert를 띄움
    //                     }

    //              })
    //         closeUpdate();
    //     } catch (error) {
    //         console.error('Error during the /model request:', error);
    //         alert('요청 처리 중 에러가 발생했습니다.');
    //     }
    // }, [files, buildingData, closeUpdate]);
    
    return (
    <Modal
            isOpen={upmodalIsOpen}
            onRequestClose={closeUpdate}
            style={customStyles}
            contentLabel="File Upload Modal"
        >
            <div style={{position: 'relative'}}>
                <button onClick={closeUpdate} className='btn btn-primary btn-x'><IoClose/></button>
                <br/>
                <br/>
                <h3>해당 층의 이미지 파일 추가</h3>
                
                <div className="file_upload" style={fileUploadContainerStyle}>
                           
                    <input type="file" ref={fileInputRef} onChange={handleFileChange}
                        style={{marginBottom: '10px'}}/>
                </div>
                <br/>
                <div>
                    <button onClick={handleFileUpload} className='btn btn-primary btn-send'>전송</button>
                </div>
            </div>
    </Modal>
  )
}

export default UpdateSidebar