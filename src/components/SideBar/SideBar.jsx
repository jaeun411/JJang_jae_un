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

function SideBar() {
    const { isLogin, logout, userInfo } = useContext(LoginContext);
    const navigate = useNavigate();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [buildings, setBuildings] = useState([]);
    const [floors, setFloors] = useState([]);

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
    };

    const openModal = () => {
        if (!modalIsOpen) {
            setModalIsOpen(true);
        }
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    // 건물 이름 가져오기
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

    const fetchFloors = (buildingId) => {
        axios.get(`/file/${buildingId}/list`)
            .then(response => {
                setFloors(response.data);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    };


    return (
        <>
            {[false].map((expand) => (
                <Navbar key={expand} expand={expand} className="bg-white">
                    <Container fluid>
                        <Navbar.Brand href="#"></Navbar.Brand>
                        <Navbar.Toggle aria-controls="offcanvasNavbar-expand-lg" placement="end" style={{ marginRight: 'auto' }} />
                        <Navbar.Offcanvas
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
                                    </Offcanvas.Header>
                                    <hr/>
                                    <Offcanvas.Body>
                                        <Nav className="flex-grow-1 pe-3">
                                            <div>
                                                <Button style={buttonStyle} onClick={openModal}>
                                                    파일 추가하기
                                                </Button>
                                                <UploadModal isOpen={modalIsOpen} closeModal={closeModal}/>
                                            </div>
                                            {buildings.map((building, index) =>
                                                <NavDropdown
                                                    key={index}
                                                    title={building.buildingName}
                                                    id={`offcanvasNavbarDropdown-${building.buildingId}`}
                                                    onClick={() => fetchFloors(building.buildingId)}
                                                >
                                                    {floors.map((floor, index) =>
                                                        <NavDropdown.Item
                                                            key={index}
                                                        >
                                                            {`${floor.floorNum}층 (${floor.updateDate})`}
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