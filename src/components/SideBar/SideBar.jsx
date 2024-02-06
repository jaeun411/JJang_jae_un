import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import React, {useContext, useEffect, useState} from "react";
import {LoginContext} from "../../contexts/LoginContextProvider";
import {Link, useNavigate} from "react-router-dom";
import * as Swal from "../../apis/alert";
import './SideBar.css';
import UploadModal from "../UploadModal/UploadModal";
import * as auth from "../../apis/auth";
import axios from "axios";
import { IoRefresh } from "react-icons/io5";
import CreateCode from "../../pages/QR";
import { IoPersonSharp } from "react-icons/io5";

function SideBar({setGltfBlobUrl, setJsonData, setBuildingId, setFloorNum}) {
    const {isLogin, logout, userInfo} = useContext(LoginContext);
    const navigate = useNavigate();

    const [modalIsOpen, setModalIsOpen] = useState(false);

    const [buildings, setBuildings] = useState([]);
    const [floors, setFloors] = useState([]);
    const [modelUrl, setModelUrl] = useState(null);
    const [buildingId, setBuildingId] = useState(null);
    const [floorNum, setFloorNum] = useState(null);
    const [offcanvas, setOffcanvas] = useState(false);

    const [buildingData, setbuildingData] = useState({
        buildingName: '',
        floorCount: 0
    });

    const [offcanvas, setOffcanvas] = useState(false);


    /**
     * 사이드바 열고닫는
     */
    const openoffcanvas = () => {
        setOffcanvas(!offcanvas);
    }
    const openModal = () => {
        if (!modalIsOpen) {
            setModalIsOpen(true);
            closeoffcanvas();
        }
    };
    const closeoffcanvas = () => {
        setOffcanvas(false);
    }
    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleClick = () => {
        Swal.alert("로그인이 필요합니다", "로그인 화면으로 이동합니다.", "warning", () => {
            navigate("/");
        });
    };

    /**
     * 로그인 페이지로 이동
     */
    const handleButtonClick = () => {
        navigate("/");
    }

    /**
     * 로그인이 되어있을 때, 건물 리스트를 받아온다.
     */

    useEffect(() => {
        if (isLogin) {
            auth.list()
                .then(response => {
                    console.log(response.data); // 건물 리스트 로그출력
                    setBuildings(response.data);
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        }
    }, [isLogin]);


    /**
     * 빌딩 아이디 리스트 받아오기
     */
    const fetchBuildings = () => {
        if (isLogin) {
            auth.list()
                .then(response => {
                    setBuildings(response.data);
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        }
    };



    /**
     * 층 드롭다운 클릭시 해당 건물의 층 정보를 받아온다.
     * @param buildingId
     */
    const handlesClick = (buildingId) => {
        fetchFloors(buildingId);
    };

    /**
     * 해당 건물의 층의 정보를 얻어온다(층정보, 수정날짜)
     */

    const fetchFloors = (buildingId) => {
        axios.get(`/file/${buildingId}/list`)
            .then(response => {
                setFloors(response.data);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    };
    //건물 glb파일
    const fetchBuilding = (buildingId) => {
        console.log(buildingId);
        const url = `/file/${buildingId}`;
        
        axios.get(url, { responseType: 'blob' }) // Blob 형태로 받아옵니다.
            .then(response => {
                console.log(response);
                const blob = response.data;
                const blobUrl = URL.createObjectURL(blob); // Blob URL을 생성합니다.
                setGltfBlobUrl(blobUrl); // Blob URL을 상태로 저장합니다.
                
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    };

    const handlesClick = (buildingId) => {
        fetchFloors(buildingId);
        // fetchBuilding(buildingId);
    };


    //빌딩id,층수를 넘겨주면, 3D 도면 glb파일
    const fetchModel = (buildingId, floor) => {
        //floor에 데이터가 null이 아닐 때만 실행
        if(floor.null==false)
        {
            const url = `/file/${buildingId}/${floor.floorNum}`;
            axios.get(url) // Blob 형태로 받아옵니다.
            // { responseType: 'blob' }
            .then(response => {
                const floorFileData = response.data.floorFileData;
                const metaData = response.data.metaData;

                const decodedString = atob(metaData);
                const utf8Decoder = new TextDecoder('utf-8');
                const jsonData = utf8Decoder.decode(new Uint8Array(decodedString.split('').map(char => char.charCodeAt(0))));

                //console.log(objectJson);

                // floorFileData를 base64 디코딩하여 Blob 생성
                const byteCharacters = atob(floorFileData);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                  byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: 'application/octet-stream' });


                const blobUrl = URL.createObjectURL(blob); // Blob URL을 생성합니다.
                setGltfBlobUrl(blobUrl); // Blob URL을 상태로 저장합니다.
                setJsonData(jsonData);
                setBuildingId(buildingId);
                setFloorNum(floor.floorNum);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
        }
    };


    /**
     * 건물(building) 모델 받아오기
     */
    const fetchBuilding = (buildingId) => {
        console.log(buildingId);

        const url = `/file/${buildingId}`;
        axios.get(url, {responseType: 'blob'}) // Blob 형태로 받아옵니다.
            .then(response => {
                console.log(response);

                const blob = response.data;
                const blobUrl = URL.createObjectURL(blob); // Blob URL을 생성합니다.

                setGltfBlobUrl(blobUrl); // Blob URL을 상태로 저장합니다.
                setBuildingId(buildingId); // 건물 아이디를 상태로 저장합니다.
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    };


    /**
     * 해당 건물의 층 모델 받아오기
     * @param buildingId
     * @param floor
     */
    const fetchModel = (buildingId, floor) => {
        //floor에 데이터가 null이 아닐 때만 실행
        if(floor.null===false)
        {
            const url = `/file/${buildingId}/${floor.floorNum}`;
            axios.get(url) // Blob 형태로 받아옵니다.
                // { responseType: 'blob' }
                .then(response => {
                    const floorFileData = response.data.floorFileData;
                    const metaData = response.data.metaData;


                    const decodedString = atob(metaData);
                    const utf8Decoder = new TextDecoder('utf-8');
                    const jsonString = utf8Decoder.decode(new Uint8Array(decodedString.split('').map(char => char.charCodeAt(0))));
                    const jsonData = JSON.parse(jsonString);

                    // floorFileData를 base64 디코딩하여 Blob 생성
                    const byteCharacters = atob(floorFileData);
                    const byteNumbers = new Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    const byteArray = new Uint8Array(byteNumbers);
                    const blob = new Blob([byteArray], {type: 'application/octet-stream'});


                    const blobUrl = URL.createObjectURL(blob); // Blob URL을 생성합니다.
                    setGltfBlobUrl(blobUrl);    // Blob URL을 상태로 저장합니다.
                    setJsonData(jsonData);      // JSON 데이터를 상태로 저장합니다.
                    setBuildingId(buildingId);  // 건물 아이디를 상태로 저장합니다.
                    setFloorNum(floor.floorNum);         // 층 정보를 상태로 저장합니다.
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        }
    };


    return (
        <>
            {[false].map((expand) => (
                <Navbar key={1} expand={expand} className="bg-navy">
                    <Container fluid>
                        <Navbar.Brand href="#"></Navbar.Brand>
                        <Navbar.Toggle aria-controls="offcanvasNavbar-expand-lg" placement="end"
                                       style={{marginRight: 'auto'}} onClick={openoffcanvas}/>
                        <Navbar.Offcanvas show={offcanvas} onHide={closeoffcanvas}
                                          id="offcanvasNavbar-expand-lg"
                                          aria-labelledby="offcanvasNavbarLabel-expand-lg"
                                          placement="start"

                        >
                            {!isLogin ?
                                <>
                                    <Offcanvas.Header closeButton style={{backgroundColor : '#fdf6de'}}>
                                        <Offcanvas.Title id="offcanvasNavbarLabel-expand-lg" style={{fontSize: '23px'}}>
                                            <div>
                                                <button onClick={handleButtonClick} style={{
                                                    border: "none",
                                                    backgroundColor: "#fdf6de",
                                                    color : 'red',
                                                    fontSize: '23px'
                                                }}>
                                                    <li className="font2" style={{display: 'inline'}}>로그인</li>
                                                </button>
                                                이 필요합니다.
                                            </div>
                                        </Offcanvas.Title>
                                    </Offcanvas.Header>

                                    <Offcanvas.Body style={{backgroundColor : '#fdf6de'}}>
                                        <Nav className="flex-grow-1 pe-3">
                                            <Button style={{backgroundColor : '#7a573e', color : 'white'}} onClick={handleClick}>
                                                파일 추가하기
                                            </Button>
                                            <NavDropdown
                                                title="3D 목록"
                                                id="offcanvasNavbarDropdown-expand-lg"
                                            >
                                                <NavDropdown.Item onClick={handleClick} style={{color : 'red'}}>
                                                    로그인이 필요합니다.
                                                </NavDropdown.Item>
                                            </NavDropdown>
                                        </Nav>
                                    </Offcanvas.Body>
                                </>
                                :
                                <>
                                    <Offcanvas.Header closeButton style={{backgroundColor : '#fdf6de'}}>
                                        <Offcanvas.Title id="offcanvasNavbarLabel-expand-lg" style={{fontSize : '23px'}}>
                                            <span style={{color: '#7a573e'}}>
                                                <IoPersonSharp/> {userInfo.userId}
                                            </span>님 환영합니다
                                        </Offcanvas.Title>
                                        <button className='refresh' onClick={fetchBuildings}><IoRefresh className='refresh' /></button>

                                    </Offcanvas.Header>

                                    <Offcanvas.Body style={{backgroundColor : '#fdf6de'}}>
                                        <Nav className="flex-grow-1 pe-3">
                                            <div>
                                                <UploadModal isOpen={modalIsOpen} closeModal={closeModal}/>
                                                <Button style={{backgroundColor : '#7a573e', color : 'white'}} onClick={openModal}>
                                                    파일 추가하기
                                                </Button>
                                            </div>

                                            {/* 여기가 건물 이름 리스트 뜨는 부분 */}

                                            {buildings.map((building, index) =>
                                                <NavDropdown
                                                    className='dropDownItemTitleStyle'

                                                    key={index}
                                                    title={building.buildingName}
                                                    id={`offcanvasNavbarDropdown-${building.buildingId}`}
                                                    onClick={() => handlesClick(building.buildingId)}
                                                >
                                                    <NavDropdown.Item className='dropDownButtonStyle'>
                                                        <Button onClick={()=> fetchBuilding(building.buildingId)}>건물 도면</Button>
                                                        <CreateCode buildingId={building.buildingId} setOffcanvas={setOffcanvas}/>
                                                    </NavDropdown.Item>


                                                    {/* 해당 건물을 눌렀을 때 뜨는  층정보*/}
                                                    {floors.map((floor, index) =>
                                                        <NavDropdown.Item
                                                            key={index}
                                                            onClick={() => {
                                                                fetchModel(building.buildingId, floor);
                                                            }}
                                                        >
                                                            <NavDropdown.Item className='dropDownButtonStyle'>
                                                                {
                                                                    floor.null !== true ? (
                                                                        `${floor.floorNum}층 - 수정 날짜 : (${new Date(floor.updateDate).toISOString().slice(0, 10)})`
                                                                    ) : (
                                                                        <span>비어있음</span>
                                                                    )
                                                                }
                                                            </NavDropdown.Item>

                                                        </NavDropdown.Item>
                                                    )}
                                                   
                                                </NavDropdown>
                                                
                                            )}
                                        </Nav>
                                    </Offcanvas.Body>
                                    <button className='logout_link buttonStyle1' onClick={() => logout()}>로그아웃
                                    </button>
                                </>
                            }
                        </Navbar.Offcanvas>
                    </Container>
                </Navbar>
            ))}
        </>
    );
}

export default SideBar;
