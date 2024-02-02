import { useState } from 'react';
import QRCode from 'qrcode.react';
import Button from "react-bootstrap/Button";
import { useNavigate } from 'react-router-dom';
import * as Swal from "../apis/alert";


const CreateCode = ({buildingId}) => {
    let [pageLink, setPageLink] = useState(null);
    let [showQRCode, setShowQRCode] = useState(false); // 추가된 상태 변수
    const navigate = useNavigate();


    // QR 코드 생성
    const generateQRCode = () => {
        console.log(buildingId)   // 받아온 buildingId 정보 확인
        if (!buildingId) {
            console.log('Invalid buildingId');
            return;
        }
        setPageLink(`http://10.101.180.209:3000/guest?buildingId=${buildingId}`);
        console.log(pageLink)   // 생성된 페이지 링크 확인

        setShowQRCode(true); // QR 코드 표시

        if(showQRCode===true){
            setShowQRCode(false);
        }
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
            <Button onClick={(e ) => {
                e.stopPropagation();
                generateQRCode();
            }}>
                건물 QR코드 생성
            </Button>

            {
                showQRCode &&
                (<QRCode value={pageLink} onClick={qrButtonClick}/>) // 상태 변수에 따라 QR 코드 표시
            }
        </div>
    );
};

export default CreateCode;
