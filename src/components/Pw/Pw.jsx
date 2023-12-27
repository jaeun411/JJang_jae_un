import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import LoginForm from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal'
import 'bootstrap/dist/css/bootstrap.min.css';


function PwForm() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <label onClick={handleShow}>
                비밀번호 찾기
            </label>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>비밀번호 찾기</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <LoginForm>
                        <LoginForm.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <LoginForm.Label>Name</LoginForm.Label>
                            <LoginForm.Control rows={1} />
                        </LoginForm.Group>
                        <LoginForm.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <LoginForm.Label>ID</LoginForm.Label>
                            <LoginForm.Control rows={1} />
                        </LoginForm.Group>
                        <LoginForm.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <LoginForm.Label>Email address</LoginForm.Label>
                            <LoginForm.Control
                                type="email"
                                placeholder="email@example.com"
                                autoFocus
                            />
                        </LoginForm.Group>
                    </LoginForm>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Find
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default PwForm;