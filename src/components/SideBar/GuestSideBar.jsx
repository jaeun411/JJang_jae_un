import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import React, { useEffect, useState} from "react";
import './SideBar.css';
import axios from "axios";


function GuestSideBar({buildingId, setGltfBlobUrl, setJsonData}){
    let [floors, setFloors] = useState([]);          // 층 정보 리스트(층수, 수정날짜, 도면이 있는지 없는지)
    let [buildingName, setBuildingName] = useState(null);   // 건물 아이디
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleClose = () => {
        setSidebarOpen(false);
    };

    const handleOpen = () => {
        setSidebarOpen(true);
    }

    useEffect(() => {
        fetchBuildingName(buildingId)
    }, []);

    // 건물 층 리스트
    const fetchFloors = (buildingId) => {
        axios.get(`/guest/${buildingId}/list`)
            .then(response => {
                setFloors(response.data);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    };

    // 건물 파일 불러오기
    const fetchBuilding = (buildingId) => {
        const url = `/guest/${buildingId}`;
        axios.get(url, { responseType: 'blob' }) // Blob 형태로 받아옵니다.
            .then(response => {
                const blob = response.data;
                const blobUrl = URL.createObjectURL(blob); // Blob URL을 생성합니다.
                setGltfBlobUrl(blobUrl); // Blob URL을 상태로 저장합니다.
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    };

    const fetchBuildingName = (buildingId) => {
        console.log(`/guest/${buildingId}/name`);
        const url = `/guest/${buildingId}/name`;
        axios.get(url) // Blob 형태로 받아옵니다.
            .then(response => {
                setBuildingName(response.data);
                console.log(response.data)
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    //빌딩id,층수를 넘겨주면, 3D 도면 glb파일
    const fetchModel = (buildingId, floor) => {
        //floor에 데이터가 null이 아닐 때만 실행
        if(floor.null==false)
        {
            const url = `/guest/${buildingId}/${floor.floorNum}`;
            axios.get(url) // Blob 형태로 받아옵니다.
                // { responseType: 'blob' }
                .then(response => {
                    const floorFileData = response.data.floorFileData;
                    const metaData = response.data.metaData;

                    const decodedString = atob(metaData);
                    const utf8Decoder = new TextDecoder('utf-8');
                    const jsonData = utf8Decoder.decode(new Uint8Array(decodedString.split('').map(char => char.charCodeAt(0))));
                    //console.log(jsonData)

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
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        }
    };

    return (
        <>
            {[false].map((expand) => (
                <Navbar key={expand} expand={expand} className="bg-navy">
                    <Container fluid>
                        <Navbar.Brand href=""/>
                        <Navbar.Toggle
                            aria-controls="offcanvasNavbar-expand-lg"
                            placement="end"
                            onClick={handleOpen}
                        />
                        <Navbar.Offcanvas
                            show={sidebarOpen}
                            onHide={handleClose}
                            id="offcanvasNavbar-expand-lg"
                            aria-labelledby="offcanvasNavbarLabel-expand-lg"
                            placement="start"
                            style={{backgroundColor: '#fdf2e9'}}
                        >
                            <Offcanvas.Header closeButton>
                                <Offcanvas.Title id="offcanvasNavbarLabel-expand-lg" style={{fontSize: '23px'}}>
                                    <div>
                                        환영합니다.
                                    </div>
                                </Offcanvas.Title>
                            </Offcanvas.Header>

                            <Offcanvas.Body>
                                <Nav>
                                    <div>
                                        <NavDropdown
                                            title={`${buildingName}`}
                                            id="offcanvasNavbar-expand-lg-dropdown"
                                            onClick={() => {
                                                fetchBuilding(buildingId);
                                                fetchFloors(buildingId);
                                            }}
                                        >
                                            {floors.map((floor, index) =>
                                                <NavDropdown.Item
                                                    key={index}
                                                    onClick={() => {
                                                        fetchModel(buildingId, floor);
                                                        handleClose();
                                                    }}
                                                >
                                                    {`${floor.floorNum}층`}
                                                </NavDropdown.Item>
                                            )}
                                        </NavDropdown>
                                    </div>
                                </Nav>
                            </Offcanvas.Body>
                        </Navbar.Offcanvas>
                    </Container>
                </Navbar>
            ))}
        </>
    );
}

export default GuestSideBar;