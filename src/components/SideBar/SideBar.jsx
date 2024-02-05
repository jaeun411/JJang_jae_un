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
import { IoMdRefresh } from "react-icons/io";
import UpdateSidebar from './updateSidebar';
import CreateCode from "../../pages/QR";

function SideBar({ setGltfBlobUrl, setJsonData, setFloorNum, setBuildingId}) {
    const { isLogin, logout, userInfo } = useContext(LoginContext);
    const navigate = useNavigate();

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [upmodalIsOpen, setUpmodalIsOpen] = useState(false);

    const [buildings, setBuildings] = useState([]);
    const [floors, setFloors] = useState([]);
    const [offcanvas, setOffcanvas] = useState(false);

    const [buildingData, setbuildingData] = useState({
        buildingName: '',
        floorCount: 0
    });

    const handleClick = () => {
        Swal.alert("로그인이 필요합니다", "로그인 화면으로 이동합니다.", "warning", () => {
            navigate("/");
        });
    };

    const buttonStyle = {
        backgroundColor: 'skyblue',
        color: 'white',
        fontSize: '20px',
    };

    const buttonStyle2 = {
        backgroundColor: 'white',
        color: 'grey',
        fontSize: '20px',
        marginRight: '40px'
    };


    const openModal = () => {
        if (!modalIsOpen) {
            setModalIsOpen(true);
            closeoffcanvas();
        }
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const openUpdate = () => {
        if (!upmodalIsOpen) {
            console.log("Updating modal");
            setUpmodalIsOpen(true);
            closeoffcanvas();
        }
    };

    const closeUpdate = () => {
        setUpmodalIsOpen(false);
    };

    const openoffcanvas = () => {
        setOffcanvas(!offcanvas);
    }
    const closeoffcanvas = () => {
        setOffcanvas(false);
    }


    //빌딩 아이디 리스트 받아오기
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

    const floordelete = (buildingid, floornum) => {
        console.log("삭제에 대한 요청")
        const response = auth.delFloor(buildingid.buildingId, floornum.floorNum);
    };

    const floorupdate = (buildingid, floornum) => {
        console.log("수정에 대한 요청")
        setbuildingData({
            buildingName: buildingid.buildingId,
            floorCount: floornum.floorNum
        });
        openUpdate();
    };

    const buildingdelete =(buildingid) =>{
        console.log("건물 삭제 요청", buildingid)
        const response = auth.delBuild(buildingid.buildingId);
        console.log(response.status);
        if(response.status==200)
        {
            Swal.alert("삭제 성공", "사이드바를 확인 해주세요.", "success");  // alert를 띄움;
        }

    }

    useEffect(() => {
        if (isLogin) {
            auth.list()
                .then(response => {
                    console.log(response.data); // Add this line
                    setBuildings(response.data);
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        }
    }, [isLogin]);

    //해당 건물의 층의 정보를 얻어온다(층정보, 수정날짜)
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

    return (
        <>
            {[false].map((expand) => (
                <Navbar key={expand} expand={expand} className="bg-white">
                    <Container fluid>
                        <Navbar.Brand href="#"></Navbar.Brand>
                        <Navbar.Toggle aria-controls="offcanvasNavbar-expand-lg" placement="end" style={{ marginRight: 'auto' }} onClick={openoffcanvas} />
                        <Navbar.Offcanvas show={offcanvas} onHide={closeoffcanvas}
                                          id="offcanvasNavbar-expand-lg"
                                          aria-labelledby="offcanvasNavbarLabel-expand-lg"
                                          placement="start"
                        >
                            { !isLogin ?
                                <>
                                    <Offcanvas.Header closeButton>
                                        <Offcanvas.Title id="offcanvasNavbarLabel-expand-lg">
                                            <div>
                                                <Link to="/">
                                                    <li className="font" style={{display: 'inline'}}>로그인</li>
                                                </Link>
                                                이 필요합니다.
                                            </div>
                                        </Offcanvas.Title>
                                    </Offcanvas.Header>
                                    <Offcanvas.Body>
                                        <Nav className="flex-grow-1 pe-3">
                                            <Button onClick={handleClick}>
                                                파일 추가하기
                                            </Button>
                                            <NavDropdown
                                                title="3D 목록"
                                                id="offcanvasNavbarDropdown-expand-lg"
                                            >
                                                <NavDropdown.Item onClick={handleClick}>
                                                    로그인이 필요합니다.
                                                </NavDropdown.Item>
                                            </NavDropdown>
                                        </Nav>
                                    </Offcanvas.Body>
                                </>
                                :
                                <>
                                    <Offcanvas.Header closeButton>
                                        <Offcanvas.Title id="offcanvasNavbarLabel-expand-lg">
                                            <span style={{color: 'blue'}}>{userInfo.userId}</span> 님 환영합니다.
                                        </Offcanvas.Title>
                                        <Button onClick={fetchBuildings}><IoMdRefresh /></Button>
                                    </Offcanvas.Header>
                                    <hr/>
                                    <Offcanvas.Body>
                                        <Nav className="flex-grow-1 pe-3">
                                            <div>
                                                <UploadModal isOpen={modalIsOpen} closeModal={closeModal}/>
                                                <UpdateSidebar upmodalIsOpen={upmodalIsOpen} closeUpdate={closeUpdate} buildingData={buildingData}/>

                                                <Button style={buttonStyle} onClick={openModal}>
                                                    파일 추가하기
                                                </Button>
                                            </div>
                                            {/* 여기가 건물 이름 리스트 뜨는 부분 */}

                                            {buildings.map((building, index) =>
                                                <NavDropdown

                                                    key={index}
                                                    title={building.buildingName}
                                                    id={`offcanvasNavbarDropdown-${building.buildingId}`}
                                                    onClick={() => handlesClick(building.buildingId)}
                                                >
                                                    <div>
                                                        <Button style={buttonStyle2} onClick={()=> fetchBuilding(building.buildingId)}>건물 도면</Button>
                                                        <Button style={buttonStyle2} onClick={()=> buildingdelete(building)}>삭제</Button>
                                                    </div>
                                                    <NavDropdown.Item>
                                                        <CreateCode buildingId={building.buildingId}/>
                                                    </NavDropdown.Item>
                                                    {/* 해당 건물을 눌렀을 때 뜨는  층정보*/}
                                                    {floors.map((floor, index) =>
                                                        <NavDropdown.Item
                                                            key={index}
                                                            style={{ textAlign: 'center' }}
                                                            onClick={() => {
                                                                fetchModel(building.buildingId, floor);
                                                                setBuildingId(building.buildingId);
                                                                setFloorNum(floor.floorNum);
                                                            }}
                                                        >
                                                            <NavDropdown.Item>
                                                                {
                                                                    floor.null!==true?(
                                                                        `${floor.floorNum}층 - 수정 날짜 : (${new Date(floor.updateDate).toISOString().slice(0,10)})`
                                                                    ):(
                                                                        <span>비어있음</span>
                                                                    )
                                                                }
                                                                <NavDropdown.Item>
                                                                    {
                                                                        floor.null!==true?(
                                                                            <div>
                                                                                <Button style={buttonStyle} onClick={()=>floordelete(building,floor)} >삭제</Button>
                                                                            </div>

                                                                        ):(
                                                                            <div>
                                                                                <Button style={buttonStyle} onClick={()=>{
                                                                                    floorupdate(building,floor)

                                                                                }} >수정</Button>
                                                                            </div>

                                                                        )
                                                                    }
                                                                </NavDropdown.Item>
                                                            </NavDropdown.Item>
                                                        </NavDropdown.Item>
                                                    )}

                                                </NavDropdown>

                                            )}
                                        </Nav>
                                    </Offcanvas.Body>
                                    <button className='logout_link' onClick={() => logout()} style={buttonStyle2}>로그아웃
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