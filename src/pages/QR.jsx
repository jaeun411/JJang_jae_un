import { useState } from 'react';
import QRCode from 'qrcode.react';
import Button from "react-bootstrap/Button";
import { useNavigate } from 'react-router-dom';
import * as Swal from "../apis/alert";
import Modal from 'react-bootstrap/Modal';


const CreateCode = ({buildingId, setOffcanvas}) => {
    let [pageLink, setPageLink] = useState(null);
    const navigate = useNavigate();
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = () => {
        setModalIsOpen(true);
    }

    const closeModal = () => {
        setModalIsOpen(false);
    }


    // QR 코드 생성
    const generateQRCode = () => {
        console.log(buildingId)   // 받아온 buildingId 정보 확인
        if (!buildingId) {
            console.log('Invalid buildingId');
            return;
        }
        setPageLink(`http://10.101.180.209:3000/guest?buildingId=${buildingId}`);
        console.log(pageLink)   // 생성된 페이지 링크 확인

        openModal();
    };


    // QR 코드 클릭 시, 해당 페이지로 이동 ( 임시 )
    const qrButtonClick = () => {
        Swal.confirms("사용자 페이지로 이동하시겠습니까?", "", "question",
            (result) => {
                if( result.isConfirmed ) {
                    navigate(`/guest?buildingId=${buildingId}`)
                }
            })
    }


    return (
        <div>
            {/* QR 코드 생성 버튼 */}
            <Button onClick={generateQRCode}>QR생성</Button>
            <Modal show={modalIsOpen} onHide={closeModal}
                   style={{
                       width: '15%', // 원하는 너비를 설정합니다.
                       height: '50%', // 원하는 높이를 설정합니다.
                       position: 'fixed',
                       top: '50%',
                       left: '50%',
                       transform: 'translate(-50%, -50%)'
                   }}>
                <Modal.Header closeButton>
                    <Modal.Title>QR 코드</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <QRCode value={pageLink} onClick={qrButtonClick}/>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default CreateCode;
