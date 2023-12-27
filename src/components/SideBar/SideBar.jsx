import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import React, { useContext } from "react";
import { LoginContext } from "../../contexts/LoginContextProvider";
import { Link, useNavigate } from "react-router-dom";
import * as Swal from "../../apis/alert";
import './SideBar.css';

function SideBar() {
    const { isLogin, logout, userInfo } = useContext(LoginContext);
    const navigate = useNavigate();

    const handleClick = () => {
        Swal.alert("로그인이 필요합니다", "로그인 화면으로 이동합니다.", "warning", () => {
            navigate("/");
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
                                            <Link to="/"><li className="font">로그인이 필요합니다.</li></Link>
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
                                            <Button as={Link} to="/FileUpload">
                                                파일 추가하기
                                            </Button>
                                            <Nav.Link href="/">Home</Nav.Link>
                                            <NavDropdown
                                                title="3D 목록"
                                                id="offcanvasNavbarDropdown-expand-lg"
                                            >
                                                <NavDropdown.Item href="#action3">리스트 쭈루룩</NavDropdown.Item>
                                            </NavDropdown>
                                            <button className='link' onClick={() => logout()}>
                                                <li className="font">로그아웃</li>
                                            </button>
                                        </Nav>
                                    </Offcanvas.Body>
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
